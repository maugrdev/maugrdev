const themeBtn = document.getElementById("theme-toggle");
const themeIco = document.getElementById("theme-ico");
const body = document.body;

const savedTheme = localStorage.getItem("theme") || "dark";
body.setAttribute("data-theme", savedTheme);
themeIco.textContent = savedTheme === "light" ? "☀️" : "🌙";

themeBtn.addEventListener("click", () => {
const next = body.getAttribute("data-theme") === "dark" ? "light" : "dark";
body.setAttribute("data-theme", next);
themeIco.textContent = next === "light" ? "☀️" : "🌙";
localStorage.setItem("theme", next);
});

const words = ["Mau", "Mauricio", "mau.dev", "dev creativo"];
let i = 0, j = 0, deleting = false;
const typed = document.getElementById("typed");

function type() {
    const current = words[i];
    typed.textContent = deleting ? current.substring(0, j--) : current.substring(0, j++);

  if (!deleting && j === current.length + 2) {
    deleting = true;
    setTimeout(type, 900);
    return;
  }
  if (deleting && j === 0) {
    deleting = false;
    i = (i + 1) % words.length;
  }
  setTimeout(type, deleting ? 60 : 110);
}
type();

const revealEls = document.querySelectorAll("[data-reveal]");
function revealCheck() {
  revealEls.forEach(el => {
    const top = el.getBoundingClientRect().top;
    if (top < window.innerHeight - 80) el.classList.add("is-visible");
  });
}
window.addEventListener("scroll", revealCheck);
revealCheck();

let lastScroll = 0;
const header = document.getElementById("site-header");

window.addEventListener("scroll", () => {
  const current = window.scrollY;
  header.classList.toggle("hidden", current > lastScroll && current > 120);
  lastScroll = current;
});

document.getElementById("hireBtn")?.addEventListener("click", () => {
  window.location.href = "#contact";
});

// 🔥 CORRECCIÓN: Usamos la ruta correcta del servidor.
const API = "/api/testimonios/testimonios";
const lista = document.getElementById("listaTestimonios");
const admin = document.getElementById("admin-testimonios");
const form = document.getElementById("formTestimonio");
const msg = document.getElementById("msg");

function escape(s = "") {
  return s.replace(/[&<>"']/g, m => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[m]));
}

function estrellas(n) {
  const full = Math.max(1, Math.min(5, Number(n) || 1));
  return `<div class="test-stars" aria-label="Valoración: ${full} de 5">
      ${Array.from({ length: 5 }, (_, i) => `
        <span class="star ${i < full ? "animate" : ""}">
          ${i < full ? "★" : "☆"}
        </span>`).join("")}
    </div>`;
}

function render(data = []) {
  lista.innerHTML = data.map(t => `
    <article class="testimonio">
      ${t.foto ? `<div class="test-img"><img src="${escape(t.foto)}" alt="${escape(t.nombre)}"></div>` : `<div class="test-img" aria-hidden></div>`}
      <div class="test-content">
        <div style="display:flex;justify-content:space-between;align-items:start;">
          <div>
            <strong>${escape(t.nombre)}</strong>
            <div class="test-time">${new Date(t.fecha).toLocaleString()}</div>
          </div>
          ${estrellas(t.rating)}
        </div>
        <p style="margin-top:8px">${escape(t.mensaje)}</p>
      </div>
    </article>
  `).join("");

  admin.innerHTML = data.map(t => `
    <div class="card">
      <strong>${escape(t.nombre)}</strong>
      <p>${escape(t.mensaje)}</p>
      <button class="btn btn-ghost" onclick="eliminarTestimonio(${t.id})">Eliminar</button>
    </div>
  `).join("");
}

// 🔥 CORRECCIÓN: Función unificada para cargar testimonios en carrusel y listas.
const cargarTestimonios = async () => {
    // 💥 Corregido el fetch para usar la ruta dinámica del servidor.
    const res = await fetch(API); 
    
    if (!res.ok) {
        console.error('Error al cargar testimonios:', res.status, res.statusText);
        return; // Detiene la ejecución si falla
    }

    const testimonios = await res.json();
    console.log("Testimonios cargados con éxito:", testimonios);

    // ✅ Llama a las funciones de render para las secciones lista y admin.
    render(testimonios);
    
    // (Asumo que renderNuevo no es necesaria o es la misma que render, pero la incluyo si quieres)
    // renderNuevo(testimonios); 

    // --- Lógica de inyección del carrusel Swiper ---
    const contenedorTestimonios = document.getElementById('contenedor-testimonios');
    
    // Limpia el contenedor del carrusel para evitar duplicados.
    if (contenedorTestimonios) contenedorTestimonios.innerHTML = ''; 

    testimonios.forEach(testimonio => {
        const testimonioHTML = `
            <div class="swiper-slide testimonio-item">
                <div class="slide-content">
                    <p class="opinion">${testimonio.opinion}</p>
                    <div class="info">
                        <img src="${testimonio.imagen}" alt="${testimonio.nombre}">
                        <div class="details">
                            <h3 class="nombre">${testimonio.nombre}</h3>
                            <span class="puesto">${testimonio.puesto}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        if (contenedorTestimonios) contenedorTestimonios.insertAdjacentHTML('beforeend', testimonioHTML);
    });

    // PASO CLAVE: Inicializa Swiper D-E-S-P-U-É-S de inyectar el contenido.
    initSwiper(); 
};


// Funció para inicializar Swiper (basado en la estructura que enviaste)
function initSwiper() {
    // Verifica si ya existe una instancia de Swiper y la destruye para reinicializarla
    if (window.mySwiperInstance) {
        window.mySwiperInstance.destroy(true, true);
    }
    
    // Código de inicialización de Swiper
    window.mySwiperInstance = new Swiper('.swiper-container', {
        loop: true,
        spaceBetween: 20,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        breakpoints: {
            640: {
                slidesPerView: 1,
            },
            768: {
                slidesPerView: 2,
            },
            1024: {
                slidesPerView: 3,
            },
        }
    });
}

// 🔥 ELIMINAMOS la función cargarSeguro() ya que su lógica se integró en cargarTestimonios().

// 🔥 ÚLTIMA CORRECCIÓN: Llamamos a la función principal al cargar el contenido.
document.addEventListener('DOMContentLoaded', () => {
    cargarTestimonios();
});
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nuevoTestimonio = {
    nombre: document.getElementById("nombre").value,
    opinion: document.getElementById("mensaje").value, // tu textarea
    puesto: "", // opcional, si no lo tienes en el form
    imagen: "user.jpg", // puedes usar un default
    rating: document.getElementById("rating").value
  };

  try {
    const res = await fetch("/api/testimonios/testimonios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevoTestimonio)
    });

    if (!res.ok) throw new Error("Error al enviar testimonio");

    msg.textContent = "✅ Testimonio enviado con éxito";
    form.reset();

    // Recargar lista de testimonios desde el servidor
    cargarTestimonios();
  } catch (err) {
    console.error(err);
    msg.textContent = "❌ Hubo un error al enviar tu testimonio";
  }
});

/* -------------------------------------------------------------
   🔥 BLOQUE DE CÓDIGO INNECESARIO ELIMINADO:
    Se eliminó el bloque 'FIX' que estaba al final de tu script original, 
    ya que duplicaba la funcionalidad de renderizado y causaba confusión.
--------------------------------------------------------------*/