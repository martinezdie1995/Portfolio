const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
	const isOpen = navLinks.classList.toggle('is-open');
	menuToggle.setAttribute('aria-expanded', isOpen);
	menuToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
});
document.querySelectorAll('.nav-links a').forEach((link) => link.addEventListener('click', () => navLinks.classList.remove('is-open')));

const revealObserver = new IntersectionObserver((entries) => entries.forEach((entry) => {
	if (entry.isIntersecting) entry.target.classList.add('visible');
}), { threshold: .12 });
document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

const projects = {
	shooter: { title: 'Shooter 2D',
		category: 'Videojuego / React / TypeScript / Canvas API',
		images: [],
		description: 'Desarrollé un videojuego shooter 2D con React y TypeScript, utilizando la API Canvas para dibujar y actualizar la escena del juego. React estructura la interfaz y TypeScript aporta tipado a la lógica de la aplicación. Las capturas y la demo jugable se agregarán próximamente.' },
	ecommerce: { title: 'Ecommerce', 
		category: 'UX / FrontEnd',
        images: ['pics/Sin título.png', 'pics/sin titulo1.png', 'pics/sin titulo 4.png', 'pics/sin titulo2.png'], 
		description: 'Implementé una tienda online con una interfaz orientada a la exploración del catálogo y a un flujo de compra sencillo. Estructuré las vistas con HTML, definí el sistema visual y la adaptación responsive con CSS, y utilicé JavaScript para implementar el filtrado de productos por categoría y simular el proceso de compra.',
        demoUrl: 'https://martinezdie1995.github.io/Ecommerce/' },
	finanzas: { title: 'FinanzaVista',
        category: 'Dashboard / APIs / Chart.js',
		images: ['pics/financiera1.png', 'pics/financiera2.png', 'pics/financiera3.png'], description: 'Desarrollé FinanzaVista como un dashboard para consultar y analizar información del mercado financiero. Integré APIs REST para obtener datos de cotizaciones, empresas, acciones, índices, riesgo país y commodities, y utilicé Chart.js para representarlos mediante gráficos interactivos. La interfaz, implementada con JavaScript y manipulación del DOM, incorpora filtros por período, alertas y generación de reportes. El proyecto también utiliza Node.js y Express, y adapta su presentación a distintas pantallas.', demoUrl: 'https://proyecto-financiero-cwge.onrender.com/' },
	tareas: { title: 'Página de tareas', category: 'Aplicación web / JavaScript', images: ['pics/todolist1.png', 'pics/todolist2.png'], description: 'Construí una aplicación web para organizar tareas y consultar su estado desde una interfaz enfocada en la claridad y la rapidez de uso. Utilicé JavaScript para implementar la interacción de la página y diseñé la presentación para facilitar la lectura y adaptarse a pantallas pequeñas.', demoUrl: 'https://martinezdie1995.github.io/Proyectos/' },
	
};
document.querySelectorAll('.project-card').forEach((card) => card.addEventListener('click', () => {
	const projectKey = card.dataset.project.toLowerCase();
	if (projects[projectKey]) window.location.href = `project.html?project=${projectKey}`;
}));

const projectDetail = document.querySelector('#project-detail');
if (projectDetail) {
	const projectKey = new URLSearchParams(window.location.search).get('project')?.toLowerCase();
	const project = projects[projectKey] || projects.ecommerce;
	const mainImage = document.querySelector('#detail-main-image');
	const mainFrame = document.querySelector('.detail-main-frame');
	const thumbnails = document.querySelector('#detail-thumbnails');
	const placeholder = document.querySelector('#detail-placeholder');

	document.title = `${project.title} | martinez.Dev`;
	document.querySelector('#detail-title').textContent = project.title;
	document.querySelector('#detail-category').textContent = project.category;
	document.querySelector('#detail-description').textContent = project.description;
	const demoLink = document.querySelector('#detail-demo');
	if (project.demoUrl) {
		demoLink.href = project.demoUrl;
		demoLink.removeAttribute('aria-disabled');
	} else {
		demoLink.removeAttribute('href');
		demoLink.setAttribute('aria-disabled', 'true');
		demoLink.textContent = 'Demo no disponible';
	}
	if (project.images.length > 0) {
		mainFrame.hidden = false;
		thumbnails.hidden = false;
		placeholder.hidden = true;
		mainImage.src = project.images[0];
		mainImage.alt = `${project.title}: imagen principal`;

		project.images.forEach((image, index) => {
			const thumbnail = document.createElement('button');
			thumbnail.type = 'button';
			thumbnail.className = `detail-thumbnail${index === 0 ? ' is-active' : ''}`;
			thumbnail.setAttribute('aria-label', `Mostrar imagen ${index + 1} de ${project.title}`);
			const thumbnailImage = document.createElement('img');
			thumbnailImage.src = image;
			thumbnailImage.alt = '';
			thumbnail.appendChild(thumbnailImage);
			thumbnail.addEventListener('click', () => {
				mainImage.src = image;
				mainImage.alt = `${project.title}: imagen ${index + 1}`;
				document.querySelectorAll('.detail-thumbnail').forEach((item) => item.classList.remove('is-active'));
				thumbnail.classList.add('is-active');
			});
			thumbnails.appendChild(thumbnail);
		});
	} else {
		mainFrame.hidden = true;
		thumbnails.hidden = true;
		placeholder.hidden = false;
		placeholder.querySelector('span').textContent = project.title;
	}
}

const contactForm = document.querySelector('#contact-form');
if (contactForm) {
	contactForm.addEventListener('submit', async (event) => {
		event.preventDefault();
		const submitButton = contactForm.querySelector('button[type="submit"]');
		const status = document.querySelector('#form-status');
		const replyTo = document.querySelector('#reply-to');
		replyTo.value = contactForm.elements.email.value;
		submitButton.disabled = true;
		submitButton.textContent = 'Enviando...';
		status.textContent = '';

		try {
			const response = await fetch(contactForm.action, {
				method: 'POST',
				body: new FormData(contactForm),
				headers: { Accept: 'application/json' }
			});
			if (!response.ok) throw new Error('No se pudo enviar el formulario');
			status.textContent = '¡Gracias! Tu mensaje se envió correctamente.';
			contactForm.reset();
		} catch (error) {
			status.textContent = 'No se pudo enviar el mensaje. Prueba nuevamente o escríbeme por Gmail.';
		} finally {
			submitButton.disabled = false;
			submitButton.innerHTML = 'Enviar mensaje <span aria-hidden="true">↗</span>';
		}
	});
}