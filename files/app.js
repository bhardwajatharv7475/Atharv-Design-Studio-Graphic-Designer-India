// VEX Application Logic, 3D Graphics, Scroll Animations, and Chatbot Simulation

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all components
  initThreeJS();
  initTypingAnimation();
  initScrollReveal();
  initStoryTabs();
  initBuildingTabs();
  initChatbot();
  initSmoothScroll();
  initHighlightButtons();
});

/* -------------------------------------------------------------
 * 1. Three.js Scroll-Driven 3D Graphics
 * ------------------------------------------------------------- */
function initThreeJS() {
  const canvas = document.getElementById('canvas-3d');
  if (!canvas) return;

  // Scene & Camera Setup
  const scene = new THREE.Scene();
  
  // Create camera with field of view, aspect ratio, near and far planes
  const camera = new THREE.PerspectiveCamera(
    45, 
    window.innerWidth / window.innerHeight, 
    0.1, 
    100
  );
  camera.position.z = 12;

  // Renderer Setup
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Geometry: Create a high-tech looking torus knot structure
  const geometry = new THREE.TorusKnotGeometry(2.5, 0.7, 120, 16, 3, 5);

  // Materials
  // 1. Line Segments (Wireframe structure)
  const wireframeGeo = new THREE.WireframeGeometry(geometry);
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.08,
    blending: THREE.AdditiveBlending
  });
  const wireframeMesh = new THREE.LineSegments(wireframeGeo, lineMaterial);
  scene.add(wireframeMesh);

  // 2. Points (Particle system mapping the geometry nodes)
  // Extract points from the geometry to create particle effect
  const pointsMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.04,
    transparent: true,
    opacity: 0.45,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending
  });
  const particleSystem = new THREE.Points(geometry, pointsMaterial);
  scene.add(particleSystem);

  // Ambient & Directional Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(5, 5, 5);
  scene.add(directionalLight);

  // Track scroll position to update 3D properties
  let scrollPercent = 0;
  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollHeight > 0) {
      scrollPercent = scrollTop / scrollHeight;
    }
  });

  // Mouse interactivity (Parallax effect)
  let mouseX = 0;
  let mouseY = 0;
  let targetMouseX = 0;
  let targetMouseY = 0;

  window.addEventListener('mousemove', (event) => {
    // Normalize coordinates (-1 to 1)
    targetMouseX = (event.clientX / window.innerWidth) * 2 - 1;
    targetMouseY = -(event.clientY / window.innerHeight) * 2 + 1;
  });

  // Resize Handler
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

  // Animation Loop
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    // Base continuous rotation
    const baseRotationY = elapsedTime * 0.05;
    const baseRotationX = elapsedTime * 0.02;

    // Scroll-driven rotations and transformations
    // Map scroll percentage (0 to 1) to rotation angles and camera movements
    const scrollRotationY = scrollPercent * Math.PI * 2.5;
    const scrollRotationX = scrollPercent * Math.PI * 1.5;

    // Apply rotations
    wireframeMesh.rotation.y = baseRotationY + scrollRotationY;
    wireframeMesh.rotation.x = baseRotationX + scrollRotationX;
    particleSystem.rotation.y = baseRotationY + scrollRotationY;
    particleSystem.rotation.x = baseRotationX + scrollRotationX;

    // Scroll-driven camera positioning
    // Phase 1 (Hero -> Story): Camera zooms in slightly
    // Phase 2 (Story -> Investing): Camera shifts to the right
    // Phase 3 (Investing -> Building): Camera zooms out slightly
    // Phase 4 (Building -> Advisory): Camera rotates upward
    camera.position.z = 12 - (scrollPercent * 4.5); // Zooms from z=12 to z=7.5
    
    // Smooth mouse parallax interpolation (easing)
    mouseX += (targetMouseX - mouseX) * 0.05;
    mouseY += (targetMouseY - mouseY) * 0.05;

    // Displace camera based on mouse movement
    camera.position.x = mouseX * 1.5;
    camera.position.y = mouseY * 1.5;
    camera.lookAt(scene.position);

    // Dynamic scale morphing of particles on scroll
    const scale = 1 + Math.sin(scrollPercent * Math.PI) * 0.15;
    wireframeMesh.scale.set(scale, scale, scale);
    particleSystem.scale.set(scale, scale, scale);

    renderer.render(scene, camera);
  }

  animate();
}

/* -------------------------------------------------------------
 * 2. Hero Typing / Character Build Animation
 * ------------------------------------------------------------- */
function initTypingAnimation() {
  const headingElement = document.getElementById('animated-heading');
  if (!headingElement) return;

  const headingContent = "Design that speaks\nbefore words do.";
  const lines = headingContent.split('\n');
  const charDelay = 25; // millisecond delay between characters

  // Clear original content
  headingElement.innerHTML = '';

  // Generate staggered span elements for each character
  let globalCharIndex = 0;

  lines.forEach((line, lineIndex) => {
    const lineContainer = document.createElement('div');
    lineContainer.style.display = 'block';
    lineContainer.style.overflow = 'hidden';
    
    // Separate characters
    const chars = line.split('');
    chars.forEach((char) => {
      const span = document.createElement('span');
      span.className = 'char';
      // Handle spaces so they render properly
      span.textContent = char === ' ' ? '\u00A0' : char;
      
      lineContainer.appendChild(span);

      // Stagger character appearance
      setTimeout(() => {
        span.classList.add('visible');
      }, globalCharIndex * charDelay);

      globalCharIndex++;
    });

    headingElement.appendChild(lineContainer);

    // Add spacing between lines
    if (lineIndex < lines.length - 1) {
      headingElement.appendChild(document.createElement('br'));
    }
  });

  // Stagger the secondary entry nodes
  setTimeout(() => {
    const fadeNodes = document.querySelectorAll('.fade-in-node');
    fadeNodes.forEach(node => {
      node.style.opacity = '1';
      node.style.transform = 'translateY(0)';
    });
  }, globalCharIndex * charDelay + 300);
}

/* -------------------------------------------------------------
 * 3. Scroll Reveal Engine (IntersectionObserver)
 * ------------------------------------------------------------- */
function initScrollReveal() {
  const elements = document.querySelectorAll('.scroll-reveal');
  
  const observerOptions = {
    root: null,
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Unobserve once animation is triggered to preserve performance
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  elements.forEach(el => observer.observe(el));
}

/* -------------------------------------------------------------
 * 4. Story Section Tabs Interaction
 * ------------------------------------------------------------- */
function initStoryTabs() {
  const buttons = document.querySelectorAll('.thesis-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      // If already active, toggle it off
      if (btn.classList.contains('active')) {
        btn.classList.remove('active');
        return;
      }

      // Deactivate all first
      buttons.forEach(b => b.classList.remove('active'));
      // Activate clicked
      btn.classList.add('active');
    });
  });
}

/* -------------------------------------------------------------
 * 5. Building Section Tabs Interaction
 * ------------------------------------------------------------- */
const projectData = {
  os: {
    title: "Brand Identity",
    description: "A complete visual identity system — from logo mark to full brand guidelines, built to work across every medium.",
    specs: [
      { label: "Deliverables", value: "Logo Suite, Colour Palette, Typography" },
      { label: "File Formats", value: "AI, PDF, PNG, SVG" },
      { label: "Tools Used", value: "Adobe Illustrator, Figma" },
      { label: "Turnaround", value: "5–7 Business Days" }
    ]
  },
  mesh: {
    title: "Print Design",
    description: "High-impact print materials crafted for real-world use — from event posters to product packaging, all print-ready.",
    specs: [
      { label: "Deliverables", value: "Posters, Flyers, Brochures, Packaging" },
      { label: "File Formats", value: "PDF (CMYK), TIFF, AI" },
      { label: "Tools Used", value: "Adobe Photoshop, Illustrator" },
      { label: "Print Ready", value: "300 DPI, Bleed & Crop Marks" }
    ]
  },
  core: {
    title: "Social Media Design",
    description: "Scroll-stopping social media content kits designed for consistency and engagement across all major platforms.",
    specs: [
      { label: "Platforms", value: "Instagram, Facebook, YouTube" },
      { label: "Deliverables", value: "Posts, Stories, Highlights, Banners" },
      { label: "Tools Used", value: "Figma, Adobe Photoshop" },
      { label: "Templates", value: "Fully Editable Source Files" }
    ]
  }
};

function initBuildingTabs() {
  const items = document.querySelectorAll('.building-item');
  const detailsPanel = document.querySelector('.building-details-panel');
  if (!detailsPanel || items.length === 0) return;

  const titleEl = detailsPanel.querySelector('.building-detail-title');
  const descEl = detailsPanel.querySelector('.building-detail-desc');
  const specSheetEl = detailsPanel.querySelector('.spec-sheet');

  items.forEach(item => {
    item.addEventListener('click', () => {
      const type = item.getAttribute('data-project');
      const data = projectData[type];
      if (!data) return;

      // Toggle active states on buttons
      items.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      // Fade out details, swap content, fade back in
      detailsPanel.style.opacity = '0';
      detailsPanel.style.transform = 'translateY(10px)';
      detailsPanel.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

      setTimeout(() => {
        titleEl.textContent = data.title;
        descEl.textContent = data.description;
        
        // Rebuild specs
        specSheetEl.innerHTML = '';
        data.specs.forEach(spec => {
          const row = document.createElement('div');
          row.className = 'spec-row';
          
          const label = document.createElement('span');
          label.className = 'spec-label';
          label.textContent = spec.label;
          
          const val = document.createElement('span');
          val.className = 'spec-value';
          val.textContent = spec.value;
          
          row.appendChild(label);
          row.appendChild(val);
          specSheetEl.appendChild(row);
        });

        detailsPanel.style.opacity = '1';
        detailsPanel.style.transform = 'translateY(0)';
      }, 300);
    });
  });
}

/* -------------------------------------------------------------
 * 6. Interactive AI Chatbot Simulation
 * ------------------------------------------------------------- */
const chatResponses = {
  pitch: "Hi! I'm Atharv Bhardwaj, a graphic designer based in Seoni, MP, India.\n\nI'm currently available for freelance projects — logo design, brand identities, social media kits, posters, and more. To get started, just fill out the contact form in the Contact section with your project details and I'll get back to you within 24 hours.",
  build: "Here's a quick look at my work:\n\n• Zara Foods — Full brand identity & packaging\n• Pulse Fitness — 30-template social media kit\n• Seoni Cultural Fest — Event branding & print\n\nScroll up to the 'Featured Projects' section to see more details on each project.",
  advisory: "I offer the following design services:\n\n• Logo Design & Brand Identity\n• Print Design (Posters, Flyers, Packaging)\n• Social Media Content Kits\n• UI/UX Mockups & Figma Prototypes\n\nAll projects include unlimited revisions until you're 100% satisfied. Use the contact form to discuss your requirements!",
  default: "Hey there! I'm Atharv's assistant.\n\nAtharv is a graphic designer from Seoni, MP, India — specialising in brand identities, print design, and social media visuals. Feel free to ask about his work, services, or drop a message via the contact form to start a project."
};

function initChatbot() {
  const overlay = document.getElementById('chat-overlay');
  const triggers = document.querySelectorAll('.trigger-chat');
  const closeBtn = document.getElementById('chat-close');
  const messageArea = document.getElementById('chat-messages');
  const chatInput = document.getElementById('chat-input');
  const chatSendBtn = document.getElementById('chat-send-btn');
  const suggestionChips = document.querySelectorAll('.suggestion-chip');

  if (!overlay || triggers.length === 0 || !closeBtn || !messageArea) return;

  // Show Chat overlay
  triggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      overlay.classList.add('active');
      chatInput.focus();
      
      // Send welcome message if chat is empty
      if (messageArea.children.length === 0) {
        sendSystemMessage("Hey! Atharv's assistant here. How can I help you today — looking to hire a designer, see some work, or learn about services?");
      }
    });
  });

  // Hide Chat overlay
  closeBtn.addEventListener('click', () => {
    overlay.classList.remove('active');
  });

  // Close when clicking outside container
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.classList.remove('active');
    }
  });

  // Send typed message
  chatSendBtn.addEventListener('click', () => {
    processUserInput();
  });

  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      processUserInput();
    }
  });

  // Send suggestion chips
  suggestionChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const option = chip.getAttribute('data-value');
      const text = chip.textContent;
      
      // Add user message bubble
      appendMessage(text, 'user');
      
      // Trigger bot response after typing delay
      showTypingIndicator();
      setTimeout(() => {
        removeTypingIndicator();
        const response = chatResponses[option] || chatResponses.default;
        appendMessage(response, 'system');
      }, 1000);
    });
  });

  function processUserInput() {
    const text = chatInput.value.trim();
    if (!text) return;

    appendMessage(text, 'user');
    chatInput.value = '';

    // Trigger typing state and reply
    showTypingIndicator();
    setTimeout(() => {
      removeTypingIndicator();
      
      // Simple parser for custom user queries
      let responseKey = 'default';
      const cleanText = text.toLowerCase();
      
      if (cleanText.includes('hire') || cleanText.includes('project') || cleanText.includes('work') || cleanText.includes('price') || cleanText.includes('cost')) {
        responseKey = 'pitch';
      } else if (cleanText.includes('portfolio') || cleanText.includes('projects') || cleanText.includes('design') || cleanText.includes('logo') || cleanText.includes('brand')) {
        responseKey = 'build';
      } else if (cleanText.includes('service') || cleanText.includes('social') || cleanText.includes('print') || cleanText.includes('what do you')) {
        responseKey = 'advisory';
      }

      const response = chatResponses[responseKey];
      appendMessage(response, 'system');
    }, 1200);
  }

  function appendMessage(text, sender) {
    const bubble = document.createElement('div');
    bubble.className = `message ${sender}`;
    
    // Replace newlines with breaks
    bubble.innerHTML = text.replace(/\n/g, '<br>');
    
    messageArea.appendChild(bubble);
    
    // Auto scroll to bottom
    messageArea.scrollTop = messageArea.scrollHeight;
  }

  function sendSystemMessage(text) {
    appendMessage(text, 'system');
  }

  function showTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'message system typing-indicator-wrapper';
    indicator.innerHTML = `
      <div class="typing-indicator">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>
    `;
    messageArea.appendChild(indicator);
    messageArea.scrollTop = messageArea.scrollHeight;
  }

  function removeTypingIndicator() {
    const indicator = messageArea.querySelector('.typing-indicator-wrapper');
    if (indicator) {
      indicator.remove();
    }
  }
}

/* -------------------------------------------------------------
 * 7. Active Nav Link Indicator and Smooth Scrolling
 * ------------------------------------------------------------- */
function initSmoothScroll() {
  const links = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');

  // Smooth scroll click handler
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetSec = document.querySelector(targetId);
      if (targetSec) {
        // Adjust for floating dock offset
        const targetOffset = targetSec.offsetTop - 80;
        window.scrollTo({
          top: targetOffset,
          behavior: 'smooth'
        });
      }
    });
  });

  // Track scroll position to update active class on links
  window.addEventListener('scroll', () => {
    let currentSectionId = '';
    const scrollPos = window.scrollY + 200; // Offset calculation

    sections.forEach(sec => {
      if (scrollPos >= sec.offsetTop) {
        currentSectionId = '#' + sec.getAttribute('id');
      }
    });

    links.forEach(link => {
      if (link.getAttribute('href') === currentSectionId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  });
}

/* -------------------------------------------------------------
 * 8. Highlight Buttons (Hover Glow & Click Ripple)
 * ------------------------------------------------------------- */
function initHighlightButtons() {
  const buttons = document.querySelectorAll('.btn-glow');
  
  buttons.forEach(btn => {
    // Create mouse glow highlight element
    let highlight = btn.querySelector('.btn-glow-highlight');
    if (!highlight) {
      highlight = document.createElement('div');
      highlight.className = 'btn-glow-highlight';
      btn.appendChild(highlight);
    }

    // Create overlay element
    let overlay = btn.querySelector('.btn-glow-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'btn-glow-overlay';
      btn.appendChild(overlay);
    }

    // Mousemove coordinate tracking
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      highlight.style.left = `${x}px`;
      highlight.style.top = `${y}px`;
    });

    // Click ripple tracking
    btn.addEventListener('click', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ripple = document.createElement('div');
      ripple.className = 'btn-glow-ripple';
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;

      // Apply button highlight color override if exists
      const highlightColor = getComputedStyle(btn).getPropertyValue('--highlight-color');
      if (highlightColor) {
        ripple.style.backgroundColor = highlightColor;
      }

      btn.appendChild(ripple);

      // Clear ripple after animation finishes
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
}
