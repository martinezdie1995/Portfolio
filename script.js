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
	ecommerce: { title: 'Ecommerce', 
		category: 'UX / FrontEnd',
        images: ['pics/Sin título.png', 'pics/sin titulo1.png', 'pics/sin titulo 4.png', 'pics/sin titulo2.png'], 
		description: 'Una experiencia de ecommerce enfocada en una navegación clara, una presentación visual del catálogo y un flujo de compra sencillo. Permite filtrar productos por categoría y simula una compra realista. Su diseño es adaptable, accesible y está construido con JavaScript puro, HTML y CSS.',
        demoUrl: 'https://martinezdie1995.github.io/Ecommerce/' },
	finanzas: { title: 'FinanzaVista',
        category: 'Dashboard / APIs / Chart.js',
		images: ['pics/financiera1.png', 'pics/financiera2.png', 'pics/financiera3.png'], description: 'FinanzaVista es un dashboard financiero para consultar y visualizar datos del mercado mediante APIs REST. Incluye cotizaciones, empresas, acciones, índices, riesgo país y commodities, con gráficos interactivos para facilitar la lectura de la información. La interfaz es responsive y fue desarrollada con JavaScript, manipulación del DOM, Chart.js, Node.js y Express. También incorpora filtros por período, alertas y generación de reportes.', demoUrl: 'https://martinezdie1995.github.io/Proyecto-Financiero/' },
	tareas: { title: 'Página de tareas', category: 'Product design / JavaScript', images: ['pics/todolist1.png', 'pics/todolist2.png'], description: 'Una aplicación de productividad para organizar tareas, consultar su estado y mantener una rutina de trabajo clara. La interfaz prioriza acciones rápidas, lectura sencilla y adaptación a pantallas pequeñas.', demoUrl: 'https://martinezdie1995.github.io/Proyectos/' },
	
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
	const thumbnails = document.querySelector('#detail-thumbnails');

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