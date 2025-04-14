/**
 * FreakyVoice - Speech Conversion Web Application
 * Modular JavaScript architecture
 * @version 1.0.0
 */

document.addEventListener('DOMContentLoaded', function() {
    // Application namespace
    const FreakyVoice = {};
    
    /**
     * UI Component - DOM Element References
     */
    FreakyVoice.UI = {
        // Common elements
        tabs: {
            buttons: document.querySelectorAll('.tab-btn'),
            contents: document.querySelectorAll('.tab-content')
        },
        
        // Text to Speech elements
        tts: {
            form: document.getElementById('tts-form'),
            textInput: document.getElementById('text-input'),
            charCount: document.getElementById('char-count'),
            languageRadios: document.getElementsByName('tts-language'),
            resetBtn: document.getElementById('reset-btn'),
            audioContainer: document.getElementById('audio-container'),
            audioPlayer: document.getElementById('audio-player'),
            downloadLink: document.getElementById('download-link'),
            shareBtn: document.getElementById('share-btn'),
            loading: document.getElementById('tts-loading')
        },
        
        // Speech to Text elements
        stt: {
            form: document.getElementById('stt-form'),
            audioInput: document.getElementById('audio-input'),
            fileUploadArea: document.getElementById('file-upload-area'),
            fileInfo: document.getElementById('file-info'),
            fileName: document.getElementById('file-name'),
            removeFileBtn: document.getElementById('remove-file'),
            languageRadios: document.getElementsByName('stt-language'),
            resetBtn: document.getElementById('stt-reset-btn'),
            resultContainer: document.getElementById('text-result-container'),
            textResult: document.getElementById('text-result'),
            copyBtn: document.getElementById('copy-btn'),
            downloadBtn: document.getElementById('download-text-btn'),
            loading: document.getElementById('stt-loading')
        },
        
        // Modal elements
        modals: {
            aboutLink: document.getElementById('about-link'),
            privacyLink: document.getElementById('privacy-link'),
            termsLink: document.getElementById('terms-link'),
            aboutModal: document.getElementById('about-modal'),
            shareModal: document.getElementById('share-modal'),
            shareLinkInput: document.getElementById('share-link'),
            copyLinkBtn: document.getElementById('copy-link-btn'),
            shareOptions: document.querySelectorAll('.share-option'),
            closeButtons: document.querySelectorAll('.close-modal')
        }
    };
    
    /**
     * Tab Navigation Controller
     * Handles switching between text-to-speech and speech-to-text tabs
     */
    FreakyVoice.TabController = {
        init() {
            this.bindEvents();
        },
        
        bindEvents() {
            const { buttons } = FreakyVoice.UI.tabs;
            
            buttons.forEach(tab => {
                tab.addEventListener('click', this.handleTabClick.bind(this));
            });
        },
        
        handleTabClick(e) {
            const { buttons, contents } = FreakyVoice.UI.tabs;
            const selectedTab = e.currentTarget;
            
            // Remove active classes
            buttons.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));
            
            // Add active class to selected tab
            selectedTab.classList.add('active');
            const tabId = selectedTab.getAttribute('data-tab');
            document.getElementById(`${tabId}-tab`).classList.add('active');
        }
    };
    
    /**
     * Text-to-Speech Controller
     * Handles converting text to speech functionality
     */
    FreakyVoice.TextToSpeechController = {
        init() {
            this.bindEvents();
        },
        
        bindEvents() {
            const ui = FreakyVoice.UI.tts;
            
            // Character counter
            ui.textInput.addEventListener('input', this.handleTextInput.bind(this));
            
            // Form submission
            ui.form.addEventListener('submit', this.handleSubmit.bind(this));
            
            // Reset button
            ui.resetBtn.addEventListener('click', this.handleReset.bind(this));
            
            // Share button
            if (ui.shareBtn) {
                ui.shareBtn.addEventListener('click', this.handleShare.bind(this));
            }
        },
        
        handleTextInput(e) {
            FreakyVoice.UI.tts.charCount.textContent = e.target.value.length;
        },
        
        async handleSubmit(e) {
            e.preventDefault();
            const ui = FreakyVoice.UI.tts;
            
            const text = ui.textInput.value.trim();
            if (!text) {
                FreakyVoice.NotificationSystem.show('Please enter some text to convert', 'error');
                return;
            }
            
            // Get selected language
            const selectedLanguage = this.getSelectedLanguage();
            
            // Show loading, hide results
            ui.loading.style.display = 'flex';
            ui.audioContainer.style.display = 'none';
            
            try {
                const response = await this.convertTextToSpeech(text, selectedLanguage);
                
                if (response.ok) {
                    await this.handleSuccessResponse(response);
                } else {
                    FreakyVoice.NotificationSystem.show('Error processing your request', 'error');
                }
            } catch (error) {
                console.error('Error:', error);
                FreakyVoice.NotificationSystem.show('An error occurred. Please try again later', 'error');
            } finally {
                ui.loading.style.display = 'none';
            }
        },
        
        async convertTextToSpeech(text, language) {
            const formData = new FormData();
            formData.append('text', text);
            formData.append('language', language);
            
            return fetch('/speak', {
                method: 'POST',
                body: formData
            });
        },
        
        async handleSuccessResponse(response) {
            const ui = FreakyVoice.UI.tts;
            const audioFileName = await response.text();
            const audioPath = `/static/audio/${audioFileName}`;
            
            ui.audioPlayer.src = audioPath;
            ui.audioPlayer.load();
            
            // Update download link
            ui.downloadLink.href = audioPath;
            ui.downloadLink.download = audioFileName;
            
            // Display audio player
            ui.audioContainer.style.display = 'block';
            
            // Auto play audio (may be blocked by browser)
            try {
                await ui.audioPlayer.play();
            } catch (playError) {
                console.log('Auto-play prevented by browser. Please click play manually.');
            }
            
            FreakyVoice.NotificationSystem.show('Text converted to speech successfully', 'success');
        },
        
        getSelectedLanguage() {
            const radios = FreakyVoice.UI.tts.languageRadios;
            for (const radio of radios) {
                if (radio.checked) {
                    return radio.value;
                }
            }
            return 'en'; // Default to English
        },
        
        handleReset() {
            const ui = FreakyVoice.UI.tts;
            ui.textInput.value = '';
            ui.charCount.textContent = '0';
            ui.audioContainer.style.display = 'none';
            ui.audioPlayer.src = '';
        },
        
        handleShare() {
            const audioPath = FreakyVoice.UI.tts.audioPlayer.src;
            FreakyVoice.UI.modals.shareLinkInput.value = window.location.origin + audioPath;
            FreakyVoice.ModalController.openModal(FreakyVoice.UI.modals.shareModal);
        }
    };
    
    /**
     * Speech-to-Text Controller
     * Handles converting speech to text functionality
     */
    FreakyVoice.SpeechToTextController = {
        init() {
            this.bindEvents();
            this.initFileDragDrop();
        },
        
        bindEvents() {
            const ui = FreakyVoice.UI.stt;
            
            // File input change handling
            ui.audioInput.addEventListener('change', this.handleFileInputChange.bind(this));
            
            // Remove file button
            ui.removeFileBtn.addEventListener('click', this.resetFileInput.bind(this));
            
            // Form submission
            ui.form.addEventListener('submit', this.handleSubmit.bind(this));
            
            // Reset button
            ui.resetBtn.addEventListener('click', this.handleReset.bind(this));
            
            // Copy and download buttons
            ui.copyBtn.addEventListener('click', this.handleCopyText.bind(this));
            ui.downloadBtn.addEventListener('click', this.handleDownloadText.bind(this));
        },
        
        initFileDragDrop() {
            const ui = FreakyVoice.UI.stt;
            
            // Prevent default behaviors for drag events
            ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
                ui.fileUploadArea.addEventListener(eventName, this.preventDefaults, false);
            });
            
            // Highlight drop area when dragging over
            ['dragenter', 'dragover'].forEach(eventName => {
                ui.fileUploadArea.addEventListener(eventName, () => {
                    ui.fileUploadArea.classList.add('dragover');
                }, false);
            });
            
            // Remove highlight when leaving or after drop
            ['dragleave', 'drop'].forEach(eventName => {
                ui.fileUploadArea.addEventListener(eventName, () => {
                    ui.fileUploadArea.classList.remove('dragover');
                }, false);
            });
            
            // Handle file drop
            ui.fileUploadArea.addEventListener('drop', this.handleFileDrop.bind(this), false);
        },
        
        preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        },
        
        handleFileDrop(e) {
            const files = e.dataTransfer.files;
            if (files.length) {
                FreakyVoice.UI.stt.audioInput.files = files;
                this.updateFileInfo(files[0]);
            }
        },
        
        handleFileInputChange(e) {
            const files = e.target.files;
            if (files.length) {
                this.updateFileInfo(files[0]);
            }
        },
        
        updateFileInfo(file) {
            const ui = FreakyVoice.UI.stt;
            
            if (!this.isValidWavFile(file)) {
                FreakyVoice.NotificationSystem.show('Please select a WAV file', 'error');
                this.resetFileInput();
                return;
            }
            
            ui.fileName.textContent = file.name;
            ui.fileInfo.style.display = 'flex';
            
            // If file size is available, show it
            if (file.size) {
                const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
                ui.fileName.textContent = `${file.name} (${fileSizeMB} MB)`;
            }
        },
        
        isValidWavFile(file) {
            return file.type === 'audio/wav' || file.name.toLowerCase().endsWith('.wav');
        },
        
        resetFileInput() {
            const ui = FreakyVoice.UI.stt;
            ui.audioInput.value = '';
            ui.fileInfo.style.display = 'none';
            ui.fileName.textContent = 'No file selected';
        },
        
        async handleSubmit(e) {
            e.preventDefault();
            const ui = FreakyVoice.UI.stt;
            
            if (!ui.audioInput.files || ui.audioInput.files.length === 0) {
                FreakyVoice.NotificationSystem.show('Please select an audio file', 'error');
                return;
            }
            
            const audioFile = ui.audioInput.files[0];
            
            // Validate file type
            if (!this.isValidWavFile(audioFile)) {
                FreakyVoice.NotificationSystem.show('Please select a WAV file', 'error');
                return;
            }
            
            // Get selected language
            const selectedLanguage = this.getSelectedLanguage();
            
            // Show loading, hide results
            ui.loading.style.display = 'flex';
            ui.resultContainer.style.display = 'none';
            
            try {
                const response = await this.convertSpeechToText(audioFile, selectedLanguage);
                
                if (response.ok) {
                    await this.handleSuccessResponse(response);
                } else {
                    const errorData = await response.json();
                    FreakyVoice.NotificationSystem.show(`Error: ${errorData.error || 'Something went wrong'}`, 'error');
                }
            } catch (error) {
                console.error('Error:', error);
                FreakyVoice.NotificationSystem.show('An error occurred. Please try again later', 'error');
            } finally {
                ui.loading.style.display = 'none';
            }
        },
        
        async convertSpeechToText(audioFile, language) {
            const formData = new FormData();
            formData.append('audio', audioFile);
            formData.append('language', language);
            
            return fetch('/recognize', {
                method: 'POST',
                body: formData
            });
        },
        
        async handleSuccessResponse(response) {
            const ui = FreakyVoice.UI.stt;
            const data = await response.json();
            
            ui.textResult.textContent = data.text;
            ui.resultContainer.style.display = 'block';
            
            FreakyVoice.NotificationSystem.show('Speech converted to text successfully', 'success');
        },
        
        getSelectedLanguage() {
            const radios = FreakyVoice.UI.stt.languageRadios;
            for (const radio of radios) {
                if (radio.checked) {
                    return radio.value;
                }
            }
            return 'en'; // Default to English
        },
        
        handleReset() {
            const ui = FreakyVoice.UI.stt;
            this.resetFileInput();
            ui.resultContainer.style.display = 'none';
            ui.textResult.textContent = '';
        },
        
        async handleCopyText() {
            const text = FreakyVoice.UI.stt.textResult.textContent;
            if (!text) return;
            
            try {
                await navigator.clipboard.writeText(text);
                FreakyVoice.NotificationSystem.show('Text copied to clipboard', 'success');
            } catch (err) {
                console.error('Could not copy text: ', err);
                FreakyVoice.NotificationSystem.show('Failed to copy to clipboard', 'error');
            }
        },
        
        handleDownloadText() {
            const text = FreakyVoice.UI.stt.textResult.textContent;
            if (!text) return;
            
            const filename = `freaky_voice_text_${new Date().getTime()}.txt`;
            FreakyVoice.Utils.downloadTextAsFile(text, filename);
            
            FreakyVoice.NotificationSystem.show('Text file downloaded', 'success');
        }
    };
    
    /**
     * Modal Controller
     * Handles all modal dialogs and their interactions
     */
    FreakyVoice.ModalController = {
        init() {
            this.bindEvents();
        },
        
        bindEvents() {
            const modals = FreakyVoice.UI.modals;
            
            // Modal open events
            modals.aboutLink?.addEventListener('click', (e) => {
                e.preventDefault();
                this.openModal(modals.aboutModal);
            });
            
            modals.privacyLink?.addEventListener('click', (e) => {
                e.preventDefault();
                // Open privacy modal if it exists
            });
            
            modals.termsLink?.addEventListener('click', (e) => {
                e.preventDefault();
                // Open terms modal if it exists
            });
            
            // Close buttons
            modals.closeButtons.forEach(btn => {
                btn.addEventListener('click', this.handleCloseClick.bind(this));
            });
            
            // Close when clicking outside content
            window.addEventListener('click', this.handleOutsideClick.bind(this));
            
            // Share link copying
            if (modals.copyLinkBtn) {
                modals.copyLinkBtn.addEventListener('click', this.handleCopyLink.bind(this));
            }
            
            // Share options
            modals.shareOptions.forEach(option => {
                option.addEventListener('click', this.handleShare.bind(this));
            });
        },
        
        openModal(modal) {
            if (modal) {
                modal.classList.add('show');
            }
        },
        
        closeModal(modal) {
            if (modal) {
                modal.classList.remove('show');
            }
        },
        
        handleCloseClick(e) {
            const modal = e.currentTarget.closest('.modal');
            this.closeModal(modal);
        },
        
        handleOutsideClick(e) {
            if (e.target.classList.contains('modal')) {
                this.closeModal(e.target);
            }
        },
        
        handleCopyLink() {
            const input = FreakyVoice.UI.modals.shareLinkInput;
            input.select();
            document.execCommand('copy');
            FreakyVoice.NotificationSystem.show('Link copied to clipboard', 'success');
        },
        
        handleShare(e) {
            const platform = e.currentTarget.getAttribute('data-platform');
            const url = encodeURIComponent(FreakyVoice.UI.modals.shareLinkInput.value);
            const text = encodeURIComponent('Check out this audio I created with FreakyVoice!');
            
            const shareUrl = this.getShareUrl(platform, url, text);
            
            if (shareUrl) {
                window.open(shareUrl, '_blank');
            }
        },
        
        getShareUrl(platform, url, text) {
            switch (platform) {
                case 'email':
                    return `mailto:?subject=${text}&body=${url}`;
                case 'facebook':
                    return `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                case 'twitter':
                    return `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
                case 'whatsapp':
                    return `https://wa.me/?text=${text} ${url}`;
                default:
                    return null;
            }
        }
    };
    
    /**
     * Notification System
     * Handles displaying notification messages to the user
     */
    FreakyVoice.NotificationSystem = {
        init() {
            this.createStyles();
        },
        
        createStyles() {
            const notificationStyles = document.createElement('style');
            notificationStyles.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 15px 20px;
                    background: white;
                    border-radius: 4px;
                    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
                    display: flex;
                    align-items: center;
                    transform: translateX(120%);
                    transition: transform 0.3s ease;
                    z-index: 1000;
                    max-width: 350px;
                }
                
                .notification.show {
                    transform: translateX(0);
                }
                
                .notification i {
                    margin-right: 10px;
                    font-size: 1.2rem;
                }
                
                .notification.success i {
                    color: var(--success-color);
                }
                
                .notification.error i {
                    color: var(--danger-color);
                }
                
                .notification.info i {
                    color: var(--primary-color);
                }
            `;
            document.head.appendChild(notificationStyles);
        },
        
        /**
         * Show a notification message
         * @param {string} message - The message to display
         * @param {string} type - The type of notification (success, error, info)
         */
        show(message, type = 'info') {
            // Create notification element
            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
            
            // Add icon based on type
            const icon = this.getIconForType(type);
            
            notification.innerHTML = `
                ${icon}
                <span>${message}</span>
            `;
            
            // Add to document
            document.body.appendChild(notification);
            
            // Animate in
            setTimeout(() => {
                notification.classList.add('show');
            }, 10);
            
            // Animate out and remove
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }, 3000);
        },
        
        getIconForType(type) {
            switch (type) {
                case 'success':
                    return '<i class="fas fa-check-circle"></i>';
                case 'error':
                    return '<i class="fas fa-exclamation-circle"></i>';
                default:
                    return '<i class="fas fa-info-circle"></i>';
            }
        }
    };
    
    /**
     * Utility Functions
     * General helper methods for the application
     */
    FreakyVoice.Utils = {
        /**
         * Download text content as a file
         * @param {string} text - The text content to download
         * @param {string} filename - The name for the downloaded file
         */
        downloadTextAsFile(text, filename) {
            const blob = new Blob([text], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            
            // Clean up
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 100);
        }
    };
    
    /**
     * Application Initialization
     * Starts up all components
     */
    FreakyVoice.init = function() {
        console.log('🎵 FreakyVoice - Initializing application...');
        
        // Initialize all components
        this.NotificationSystem.init();
        this.TabController.init();
        this.TextToSpeechController.init();
        this.SpeechToTextController.init();
        this.ModalController.init();
        
        console.log('🎵 FreakyVoice - Application ready!');
    };
    
    // Start the application
    FreakyVoice.init();
});