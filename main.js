/* ============================================================
   MAISON AURELLE — Ámbar Noir
   Capa de animación. La página es completamente legible sin JS:
   aquí solo se añade movimiento, nunca se esconde contenido
   que no se vaya a mostrar.
   ============================================================ */
(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(pointer: fine)").matches;
  var hasGsap = typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined";

  /* ----------------------------------------------------------
     Imágenes: cadena de respaldo. Si una URL falla se prueba la
     siguiente; si fallan todas, .media--fallback muestra un
     fondo diseñado (nunca un hueco gris roto).
     ---------------------------------------------------------- */
  document.querySelectorAll("img[data-fallbacks]").forEach(function (img) {
    var queue = img.getAttribute("data-fallbacks").split("|").filter(Boolean);

    function fail() {
      if (queue.length) {
        img.src = queue.shift();
      } else {
        img.removeEventListener("error", fail);
        var media = img.closest(".media");
        if (media) media.classList.add("media--fallback");
      }
    }

    img.addEventListener("error", fail);
    // Si ya había fallado antes de que cargara este script:
    if (img.complete && img.naturalWidth === 0) fail();
  });

  /* ----------------------------------------------------------
     Preloader — máximo 2 s en pantalla
     ---------------------------------------------------------- */
  var PRELOAD_MS = reduced ? 0 : 1300;

  function releasePreloader() {
    document.body.classList.remove("is-loading");
  }
  setTimeout(releasePreloader, PRELOAD_MS);
  // Cinturón de seguridad por si algo bloquea el hilo:
  window.addEventListener("load", function () {
    setTimeout(releasePreloader, PRELOAD_MS);
  });

  /* ----------------------------------------------------------
     Header: se oculta al bajar, reaparece al subir
     ---------------------------------------------------------- */
  var header = document.getElementById("header");
  var lastY = 0;
  var ticking = false;

  function onScroll() {
    var y = window.scrollY;
    header.classList.toggle("is-solid", y > 40);
    if (y > lastY && y > 160) {
      header.classList.add("is-hidden");
    } else {
      header.classList.remove("is-hidden");
    }
    lastY = y;
    ticking = false;
  }

  window.addEventListener("scroll", function () {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(onScroll);
    }
  }, { passive: true });

  /* ----------------------------------------------------------
     Newsletter (demostración: confirmación en la propia página)
     ---------------------------------------------------------- */
  var form = document.querySelector(".newsletter");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var input = form.querySelector("input");
      if (input.value && input.checkValidity()) {
        form.querySelector(".newsletter__ok").hidden = false;
        input.value = "";
      }
    });
  }

  /* ----------------------------------------------------------
     Cursor personalizado — solo puntero fino y sin reduced-motion
     ---------------------------------------------------------- */
  if (finePointer && !reduced) {
    var cursor = document.querySelector(".cursor");
    var cx = -100, cy = -100, px = -100, py = -100;

    document.body.classList.add("has-cursor");

    window.addEventListener("mousemove", function (e) {
      cx = e.clientX;
      cy = e.clientY;
    }, { passive: true });

    (function loop() {
      // Pequeño retardo elástico: el punto "persigue" al puntero
      px += (cx - px) * 0.22;
      py += (cy - py) * 0.22;
      cursor.style.transform = "translate(" + px + "px," + py + "px)";
      requestAnimationFrame(loop);
    })();

    document.querySelectorAll("a, button, .nota__media, .panel__media").forEach(function (el) {
      el.addEventListener("mouseenter", function () { cursor.classList.add("is-active"); });
      el.addEventListener("mouseleave", function () { cursor.classList.remove("is-active"); });
    });
  }

  /* ----------------------------------------------------------
     Botón magnético (escritorio)
     ---------------------------------------------------------- */
  if (finePointer && !reduced) {
    document.querySelectorAll("[data-magnetic]").forEach(function (btn) {
      btn.addEventListener("mousemove", function (e) {
        var r = btn.getBoundingClientRect();
        var dx = (e.clientX - r.left - r.width / 2) / r.width;
        var dy = (e.clientY - r.top - r.height / 2) / r.height;
        btn.style.transform = "translate(" + dx * 10 + "px," + dy * 8 + "px)";
      });
      btn.addEventListener("mouseleave", function () {
        btn.style.transform = "";
        btn.style.transition = "transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)";
        setTimeout(function () { btn.style.transition = ""; }, 700);
      });
    });
  }

  /* ----------------------------------------------------------
     Sin GSAP o con reduced-motion: aquí termina todo.
     La página queda estática y completamente visible.
     ---------------------------------------------------------- */
  if (reduced || !hasGsap) return;

  gsap.registerPlugin(ScrollTrigger);

  var EASE = "expo.out"; // pariente cercano de cubic-bezier(0.22,1,0.36,1)

  /* ----------------------------------------------------------
     Lenis smooth scroll, sincronizado con el ticker de GSAP
     ---------------------------------------------------------- */
  if (typeof Lenis !== "undefined") {
    var lenis = new Lenis({ lerp: 0.1, autoRaf: false });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);

    // Anclas internas a través de Lenis
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      var href = a.getAttribute("href");
      if (href === "#") return;
      a.addEventListener("click", function (e) {
        var target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          lenis.scrollTo(target, { offset: 0 });
        }
      });
    });
  }

  /* ----------------------------------------------------------
     Utilidades de split (sin plugins de pago)
     ---------------------------------------------------------- */
  function splitChars(el) {
    var text = el.textContent;
    el.textContent = "";
    el.setAttribute("aria-label", text);
    var frag = document.createDocumentFragment();
    text.split("").forEach(function (ch) {
      if (ch === " ") {
        frag.appendChild(document.createTextNode(" "));
        return;
      }
      var mask = document.createElement("span");
      mask.style.cssText = "display:inline-block;overflow:hidden;vertical-align:top;";
      mask.setAttribute("aria-hidden", "true");
      var span = document.createElement("span");
      span.className = "char";
      span.textContent = ch;
      mask.appendChild(span);
      frag.appendChild(mask);
    });
    el.appendChild(frag);
    return el.querySelectorAll(".char");
  }

  function splitWords(el) {
    var text = el.textContent.replace(/\s+/g, " ").trim();
    el.textContent = "";
    el.setAttribute("aria-label", text);
    var frag = document.createDocumentFragment();
    text.split(" ").forEach(function (w, i) {
      if (i > 0) frag.appendChild(document.createTextNode(" "));
      var span = document.createElement("span");
      span.className = "word";
      span.setAttribute("aria-hidden", "true");
      span.textContent = w;
      frag.appendChild(span);
    });
    el.appendChild(frag);
    return el.querySelectorAll(".word");
  }

  /* ----------------------------------------------------------
     Hero: titular carácter a carácter tras el preloader,
     parallax sutil de la imagen al hacer scroll
     ---------------------------------------------------------- */
  var heroChars = splitChars(document.querySelector("[data-split-chars]"));

  gsap.set(heroChars, { yPercent: 110 });
  gsap.set(".hero__eyebrow, .hero__sub, .hero__scroll", { autoAlpha: 0, y: 24 });

  gsap.timeline({ delay: (PRELOAD_MS + 600) / 1000 })
    .to(heroChars, { yPercent: 0, duration: 1.2, ease: EASE, stagger: 0.045 })
    .to(".hero__eyebrow, .hero__sub, .hero__scroll",
      { autoAlpha: 1, y: 0, duration: 1, ease: EASE, stagger: 0.12 }, "-=0.7");

  gsap.to(".hero__media", {
    yPercent: 14,
    ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
  });

  /* ----------------------------------------------------------
     Manifiesto: palabra a palabra con scrub
     ---------------------------------------------------------- */
  var words = splitWords(document.querySelector("[data-split-words]"));

  gsap.fromTo(words,
    { opacity: 0.12 },
    {
      opacity: 1,
      stagger: 0.05,
      ease: "none",
      scrollTrigger: {
        trigger: ".manifiesto",
        start: "top 70%",
        end: "center 35%",
        scrub: 0.6
      }
    });

  /* ----------------------------------------------------------
     Revelado de imágenes por clip-path
     ---------------------------------------------------------- */
  document.querySelectorAll("[data-reveal]").forEach(function (media) {
    var img = media.querySelector("img");
    gsap.set(media, { clipPath: "inset(0 0 100% 0)" });
    gsap.set(img, { scale: 1.15 });
    gsap.timeline({
      scrollTrigger: { trigger: media, start: "top 82%", once: true }
    })
      .to(media, { clipPath: "inset(0 0 0% 0)", duration: 1.2, ease: EASE })
      .to(img, { scale: 1, duration: 1.4, ease: EASE, clearProps: "scale" }, 0);
  });

  /* ----------------------------------------------------------
     Notas: bloques que entran alternados desde lados opuestos
     ---------------------------------------------------------- */
  document.querySelectorAll("[data-from]").forEach(function (block) {
    var body = block.querySelector(".nota__body");
    var dir = block.getAttribute("data-from") === "right" ? 1 : -1;
    gsap.from(body, {
      x: 70 * dir,
      autoAlpha: 0,
      duration: 1.2,
      ease: EASE,
      scrollTrigger: { trigger: block, start: "top 70%", once: true }
    });
  });

  /* ----------------------------------------------------------
     Ritual: horizontal con pin + scrub solo en escritorio.
     En móvil se mantiene el carrusel nativo con snap (CSS).
     ---------------------------------------------------------- */
  var mm = gsap.matchMedia();

  mm.add("(min-width: 900px)", function () {
    var ritual = document.querySelector(".ritual");
    var track = document.querySelector(".ritual__track");
    ritual.classList.add("ritual--pinned");

    var getDistance = function () {
      return track.scrollWidth - window.innerWidth;
    };

    var tween = gsap.to(track, {
      x: function () { return -getDistance(); },
      ease: "none",
      scrollTrigger: {
        trigger: ritual,
        pin: ".ritual__pin",
        scrub: 1,
        start: "top top",
        end: function () { return "+=" + getDistance(); },
        invalidateOnRefresh: true
      }
    });

    return function () {
      ritual.classList.remove("ritual--pinned");
      tween.scrollTrigger.kill();
      tween.kill();
      gsap.set(track, { clearProps: "x" });
    };
  });

  /* ----------------------------------------------------------
     El frasco: las dos palabras derivan en sentidos opuestos
     mientras la imagen permanece fija (CSS sticky)
     ---------------------------------------------------------- */
  document.querySelectorAll("[data-drift]").forEach(function (word) {
    var dir = parseInt(word.getAttribute("data-drift"), 10) || 1;
    gsap.fromTo(word,
      { xPercent: -50 + 18 * dir },
      {
        xPercent: -50 - 18 * dir,
        ease: "none",
        scrollTrigger: {
          trigger: ".frasco__stage",
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });
  });

  /* ----------------------------------------------------------
     Contadores
     ---------------------------------------------------------- */
  document.querySelectorAll("[data-count]").forEach(function (el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    var obj = { v: 0 };
    gsap.to(obj, {
      v: target,
      duration: 1.6,
      ease: "power2.out",
      onUpdate: function () { el.textContent = Math.round(obj.v); },
      scrollTrigger: { trigger: ".frasco__data", start: "top 85%", once: true }
    });
  });

  /* ----------------------------------------------------------
     Citas de prensa
     ---------------------------------------------------------- */
  document.querySelectorAll("[data-fade]").forEach(function (el) {
    gsap.from(el, {
      autoAlpha: 0,
      y: 36,
      duration: 1.2,
      ease: EASE,
      scrollTrigger: { trigger: el, start: "top 80%", once: true }
    });
  });

  /* ----------------------------------------------------------
     Recalcular cuando las imágenes alteren la maquetación
     ---------------------------------------------------------- */
  window.addEventListener("load", function () {
    ScrollTrigger.refresh();
  });
})();
