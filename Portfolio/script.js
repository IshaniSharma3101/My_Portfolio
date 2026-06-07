/**
 * Ishani Sharma Portfolio - Premium Navbar & Interactive Hero Script
 * Fully responsive, accessible, and performance-optimized.
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- Selectors ---
  const navbarHeader = document.getElementById('navbar-header');
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
  const mobileNavItems = document.querySelectorAll('.mobile-nav-item');

  // --- Drawer State ---
  let isMenuOpen = false;

  /**
   * Opens the mobile menu drawer.
   */
  const openMenu = () => {
    isMenuOpen = true;
    hamburgerBtn.classList.add('is-active');
    mobileMenu.classList.add('is-open');
    mobileMenuOverlay.classList.add('is-open');

    // Accessibility updates
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    mobileMenu.setAttribute('aria-hidden', 'false');
    mobileMenuOverlay.setAttribute('aria-hidden', 'false');

    // Prevent background scrolling while modal menu is active
    document.body.style.overflow = 'hidden';

    // Focus the first item in the mobile menu for keyboard user accessibility
    const firstLink = mobileMenu.querySelector('.mobile-nav-item');
    if (firstLink) {
      setTimeout(() => firstLink.focus(), 100);
    }
  };

  /**
   * Closes the mobile menu drawer.
   */
  const closeMenu = () => {
    isMenuOpen = false;
    hamburgerBtn.classList.remove('is-active');
    mobileMenu.classList.remove('is-open');
    mobileMenuOverlay.classList.remove('is-open');

    // Accessibility updates
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    mobileMenuOverlay.setAttribute('aria-hidden', 'true');

    // Restore background scrolling
    document.body.style.overflow = '';

    // Return focus to hamburger trigger
    hamburgerBtn.focus();
  };

  /**
   * Toggles the menu state.
   */
  const toggleMenu = () => {
    if (isMenuOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  };

  // --- Event Listeners ---

  // Hamburger Click Trigger
  hamburgerBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  // Close Menu on Overlay click
  mobileMenuOverlay.addEventListener('click', closeMenu);

  // Menu closing is handled inside the smooth scroll listener.

  // Keyboard Navigation: Escape Key closes mobile menu
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isMenuOpen) {
      closeMenu();
    }
  });

  // Keyboard navigation focus trap inside mobile menu drawer
  mobileMenu.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      const focusableEls = mobileMenu.querySelectorAll('.mobile-nav-item');
      const firstFocusable = focusableEls[0];
      const lastFocusable = focusableEls[focusableEls.length - 1];

      if (e.shiftKey) { // Shift + Tab (Backward navigation)
        if (document.activeElement === firstFocusable) {
          lastFocusable.focus();
          e.preventDefault();
        }
      } else { // Tab (Forward navigation)
        if (document.activeElement === lastFocusable) {
          firstFocusable.focus();
          e.preventDefault();
        }
      }
    }
  });

  // --- Smooth Scrolling for Navbar Links ---
  const navLinks = document.querySelectorAll('a[href^="#"]');
  
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      // Only smooth scroll if the href points to an ID on this page
      if (targetId.length > 1 && targetId.startsWith('#')) {
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
          e.preventDefault();
          
          // If in mobile menu, close it
          if (typeof closeMenu === 'function' && typeof isMenuOpen !== 'undefined' && isMenuOpen) {
            closeMenu();
          }

          // Smooth scroll to target
          targetSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  // --- Active Section Highlighting ---
  const sections = document.querySelectorAll('section[id]');
  
  const handleActiveSection = () => {
    let scrollY = window.scrollY;
    
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.getBoundingClientRect().top + window.pageYOffset - 100;
      const sectionId = current.getAttribute('id');
      
      const navLinksForSection = document.querySelectorAll(`a[href="#${sectionId}"]`);
      
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinksForSection.forEach(link => link.classList.add('active'));
      } else {
        navLinksForSection.forEach(link => link.classList.remove('active'));
      }
    });
  };

  // --- Scroll Effect Optimization ---
  let lastKnownScrollPosition = 0;
  let ticking = false;
  const floatingSocialBar = document.getElementById('floating-social-bar');
  const heroSection = document.getElementById('home');

  const handleScroll = () => {
    lastKnownScrollPosition = window.scrollY;

    // Use requestAnimationFrame to avoid page rendering lags/jank
    if (!ticking) {
      window.requestAnimationFrame(() => {
        // Navbar styling
        if (lastKnownScrollPosition > 50) {
          navbarHeader.classList.add('scrolled');
        } else {
          navbarHeader.classList.remove('scrolled');
        }

        // Floating social bar visibility (appears after scrolling past hero)
        if (floatingSocialBar && heroSection) {
          const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
          if (lastKnownScrollPosition > heroBottom - 300) {
            floatingSocialBar.classList.remove('hidden');
          } else {
            floatingSocialBar.classList.add('hidden');
          }
        }

        handleActiveSection();

        ticking = false;
      });

      ticking = true;
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });

  // Call handleScroll on startup to verify initial scroll state
  handleScroll();

  // --- Scroll Reveal Animations ---
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // Animate only once
      }
    });
  }, observerOptions);

  document.querySelectorAll('.scroll-reveal').forEach(el => {
    revealObserver.observe(el);
  });

  // --- Typewriter Typing Animation Engine ---
  const textElement = document.getElementById('typewriter-text');
  const words = [
    "a Learner",
    "a Problem Solver",
    "a Full Stack Developer",
    "an Artistic Person"
  ];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  const typeEffect = () => {
    if (!textElement) return;

    const currentWord = words[wordIndex];

    if (isDeleting) {
      // Delete characters
      textElement.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50; // Deletion is faster
    } else {
      // Type characters
      textElement.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100; // Normal writing speed
    }

    // Determine speed changes and cycles
    if (!isDeleting && charIndex === currentWord.length) {
      isDeleting = true;
      typingSpeed = 2000; // Large pause when a word is fully written
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length; // Loop around to first index
      typingSpeed = 500; // Pause before typing the next word
    }

    setTimeout(typeEffect, typingSpeed);
  };

  // Launch typewriter typing animation with initial visual stagger
  if (textElement) {
    setTimeout(typeEffect, 1000);
  }

  // --- Reading Progress Highlight Effect ---
  const bioText = document.querySelector('.bio-text');
  if (bioText) {
    // 1. Wrap each word in a span for individual tracking
    const bioWords = bioText.innerHTML.split(' ');
    bioText.innerHTML = '';
    bioWords.forEach(word => {
      if (word.trim() !== '') {
        const span = document.createElement('span');
        span.className = 'reading-word';
        span.innerHTML = word + ' ';
        bioText.appendChild(span);
      }
    });

    const readingContainer = document.getElementById('reading-text-container');
    const readingWordElements = document.querySelectorAll('.reading-word');

    const handleReadingScroll = () => {
      if (!readingContainer) return;

      const rect = readingContainer.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // Start highlighting when the container is in the middle of the viewport
      const startPoint = viewportHeight * 0.75; 
      const endPoint = viewportHeight * 0.25;
      
      let progress = (startPoint - rect.top) / (rect.height + startPoint - endPoint);
      progress = Math.max(0, Math.min(1, progress)); // Clamp between 0 and 1

      const totalWords = readingWordElements.length;
      const activeWordIndex = Math.floor(progress * totalWords);

      readingWordElements.forEach((word, index) => {
        if (index < activeWordIndex - 3) {
          word.classList.add('read');
          word.classList.remove('active');
        } else if (index >= activeWordIndex - 3 && index <= activeWordIndex + 2) {
          word.classList.add('active');
          word.classList.remove('read');
        } else {
          word.classList.remove('read');
          word.classList.remove('active');
        }
      });
    };

    window.addEventListener('scroll', () => {
      window.requestAnimationFrame(handleReadingScroll);
    }, { passive: true });
    
    handleReadingScroll(); // Init state
  }

  // --- Projects Filtering Logic ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card-modern');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Manage active states on buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      // Filter projects
      projectCards.forEach(card => {
        const categories = card.getAttribute('data-category').split(' ');
        
        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.style.display = 'flex';
          // Small timeout to allow display:flex to apply before animating opacity
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          // Wait for transition before hiding from layout
          setTimeout(() => {
            card.style.display = 'none';
          }, 400);
        }
      });
    });
  });

  // --- Contact Form Logic & EmailJS ---
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm) {
    // =========================================================
    // 1. EMAILJS INITIALIZATION
    // =========================================================
    // INSERT YOUR PUBLIC KEY BELOW (Get this from EmailJS Account > Account > API Keys)
    const PUBLIC_KEY = 'ACukcUaNxQ5DKEj3W'; 
    emailjs.init(PUBLIC_KEY);

    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      // Basic validation
      const name = document.getElementById('user_name').value.trim();
      const email = document.getElementById('user_email').value.trim();
      const subject = document.getElementById('subject').value.trim();
      const message = document.getElementById('message').value.trim();

      if (!name || !email || !subject || !message) {
        showFormStatus('Please fill out all fields.', 'error');
        return;
      }

      // Email validation regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showFormStatus('Please enter a valid email address.', 'error');
        return;
      }

      // Update button state to indicate loading
      const submitBtn = contactForm.querySelector('.btn-submit-modern');
      const originalBtnHtml = submitBtn.innerHTML;
      submitBtn.innerHTML = '<span>Sending...</span> <i class="fa-solid fa-circle-notch fa-spin"></i>';
      submitBtn.disabled = true;

      // =========================================================
      // 2. EMAILJS SEND CONFIGURATION
      // =========================================================
        const serviceID = 'service_hz7vq7f';
        const templateID = 'template_8ie8kvd';
       
        

      // Manually construct all possible variables so it cannot fail
      const templateParams = {
        user_name: name,
        user_email: email,
        subject: subject,
        message: message,
        // Common defaults just in case
        from_name: name,
        reply_to: email,
        to_name: 'Ishani',
        // CRITICAL FIX: If their template expects a to_email variable for the recipient
        // to_email: 'ishanisharma3101@gmail.com'
      };

      // Send the data using emailjs.send instead of sendForm
      emailjs.send(serviceID, templateID, templateParams, PUBLIC_KEY)
         .then(() => {

         // Auto Reply Email to Sender
         emailjs.send(
         serviceID,
         "template_y8rhrsf", // Replace with your second template ID
         templateParams,
         PUBLIC_KEY
    );

    showFormStatus(
      'Message sent successfully! I will get back to you soon.',
      'success'
    );

    contactForm.reset();
    resetSubmitBtn();

  }, (err) => {
          // Display exact error
          const errorMsg = err.text || err.message || 'Unknown Error';
          showFormStatus('EmailJS Error: ' + errorMsg, 'error');
          console.error('EmailJS Error Object:', err);
          resetSubmitBtn();
        });

      function resetSubmitBtn() {
        submitBtn.innerHTML = originalBtnHtml;
        submitBtn.disabled = false;
      }
    });

    function showFormStatus(msg, type) {
      formStatus.textContent = msg;
      formStatus.className = 'form-status-msg ' + type;
      
      // Clear message after 5 seconds
      setTimeout(() => {
        formStatus.className = 'form-status-msg';
      }, 5000);
    }
  }
});
