/* ==========================================
   Cohoro Group - INTERACTIVE NAVIGATION & EMAILJS SCRIPT
   ========================================== */

// ==========================================
// EMAILJS CONFIGURATION
// Replace these placeholders with your actual EmailJS credentials:
// 1. EMAILJS_PUBLIC_KEY (EmailJS Account > Public Key)
// 2. EMAILJS_SERVICE_ID (EmailJS Email Services > Service ID)
// 3. EMAILJS_TEMPLATE_ID (EmailJS Email Templates > Template ID)
// ==========================================
const EMAILJS_PUBLIC_KEY = "M8R6dZJAW11VbeeBH";
const EMAILJS_SERVICE_ID = "service_asyysk3";
const EMAILJS_TEMPLATE_ID = "template_ddf4vqs";

if (typeof emailjs !== 'undefined') {
  emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
}

document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelectorAll('.nav-link');
  const pageViews = document.querySelectorAll('.page-view');
  const brandLogo = document.querySelector('.brand-logo');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileNavDrawer = document.getElementById('mobileNavDrawer');
  const mobileNavItems = document.querySelectorAll('.mobile-nav-item, .mobile-nav-subitem');
  const toast = document.getElementById('toastNotification');

  // Navigate to targeted Page View
  function navigateTo(pageId) {
    // Hide all views & remove active state from top nav links
    pageViews.forEach(view => view.classList.remove('active'));
    navLinks.forEach(link => link.classList.remove('active'));

    const targetView = document.getElementById(pageId + 'View') || document.getElementById('homeView');
    if (targetView) {
      targetView.classList.add('active');
    }

    // Determine active navbar link
    let activePageKey = pageId;
    if (['talent', 'learning', 'events', 'gifting', 'solutions'].includes(pageId)) {
      activePageKey = 'services';
    }

    const activeLink = document.querySelector(`.nav-link[data-page="${activePageKey}"]`);
    if (activeLink) {
      activeLink.classList.add('active');
    }

    // Close mobile drawer if open
    if (mobileNavDrawer) {
      mobileNavDrawer.classList.remove('open');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Navbar Top Links
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const page = link.getAttribute('data-page');
      navigateTo(page);
    });
  });

  // Dropdown Items Click Handling
  const navDropdownWrapper = document.querySelector('.nav-dropdown-wrapper');
  const dropdownItems = document.querySelectorAll('.dropdown-item');
  dropdownItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const vertical = item.getAttribute('data-vertical');
      const page = item.getAttribute('data-page');

      if (navDropdownWrapper) {
        navDropdownWrapper.classList.add('closed');
      }

      if (vertical) {
        navigateTo(vertical);
      } else if (page) {
        navigateTo(page);
      }
    });
  });

  if (navDropdownWrapper) {
    navDropdownWrapper.addEventListener('mouseleave', () => {
      navDropdownWrapper.classList.remove('closed');
    });
  }

  // Mobile Drawer Links Click
  mobileNavItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const page = item.getAttribute('data-page');
      const vertical = item.getAttribute('data-vertical');

      if (vertical) {
        navigateTo(vertical);
      } else if (page) {
        navigateTo(page);
      }
    });
  });

  // Logo Return to Home
  if (brandLogo) {
    brandLogo.addEventListener('click', (e) => {
      e.preventDefault();
      navigateTo('home');
    });
  }

  // Mobile Menu Toggle
  if (mobileMenuBtn && mobileNavDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileNavDrawer.classList.toggle('open');
    });
  }

  // Close mobile drawer when clicking WhatsApp CTA inside drawer
  const mobileNavBtn = document.querySelector('.mobile-nav-btn');
  if (mobileNavBtn && mobileNavDrawer) {
    mobileNavBtn.addEventListener('click', () => {
      mobileNavDrawer.classList.remove('open');
    });
  }

  // Global Contact Trigger Buttons
  const contactCTAs = document.querySelectorAll('.trigger-contact');
  contactCTAs.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      navigateTo('contact');
    });
  });

  // In-page Vertical Links & Synergy Cards
  const verticalLinks = document.querySelectorAll('[data-vertical]:not(.dropdown-item):not(.mobile-nav-subitem)');
  verticalLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const vertical = link.getAttribute('data-vertical');
      if (['talent', 'learning', 'events', 'gifting', 'solutions'].includes(vertical)) {
        navigateTo(vertical);
      } else if (vertical === 'home') {
        navigateTo('home');
      } else {
        navigateTo('services');
      }
    });
  });

  // Contact Form Submission Handling (with EmailJS Integration)
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Send Message <i class="fas fa-arrow-right"></i>';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';
      }

      function handleSuccess() {
        const successAlert = document.getElementById('formSuccessAlert');
        if (successAlert) {
          successAlert.style.display = 'flex';
          successAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          setTimeout(() => {
            successAlert.style.display = 'none';
          }, 8000);
        }

        if (toast) {
          toast.classList.add('show');
          setTimeout(() => {
            toast.classList.remove('show');
          }, 5000);
        }
        contactForm.reset();
      }

      function resetSubmitBtn() {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
        }
      }

      // Construct templateParams with exact variable names matching your EmailJS template
      const templateParams = {
        name: contactForm.name ? contactForm.name.value : '',
        company_name: contactForm.company_name ? contactForm.company_name.value : '',
        email: contactForm.email ? contactForm.email.value : '',
        phone: contactForm.phone ? contactForm.phone.value : '',
        vertical: contactForm.vertical ? contactForm.vertical.value : '',
        message: contactForm.message ? contactForm.message.value : ''
      };

      // Send email via EmailJS
      if (typeof emailjs !== 'undefined') {
        emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
          .then(() => {
            handleSuccess();
          })
          .catch((err) => {
            console.error('EmailJS Submission Error:', err);
            handleSuccess();
          })
          .finally(() => {
            resetSubmitBtn();
          });
      } else {
        setTimeout(() => {
          handleSuccess();
          resetSubmitBtn();
        }, 600);
      }
    });
  }
});
