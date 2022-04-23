let controller;
let slideScene;
let pageScene;

const animationSlide = () => {
	//Init Controller
	controller = new ScrollMagic.Controller();
	//Selecting Elements
	const slides = document.querySelectorAll('.slide');
	//Looping over slider
	slides.forEach((slide, index) => {
		const revealImg = slide.querySelector('.reveal-img');
		const img = slide.querySelector('img');
		const revealText = slide.querySelector('.reveal-text');
		//GSAP Slide Timeline
		const slideT1 = gsap.timeline({
			defaults: { duration: 1, ease: 'power2.inOut' },
		});
		slideT1.fromTo(revealImg, { x: '0%' }, { x: '100%' });
		slideT1.fromTo(img, { scale: 2 }, { scale: 1 }, '-=0.75');
		slideT1.fromTo(revealText, { x: '0%' }, { x: '100%' }, '-=0.5');

		// Creating Slide Scene
		slideScene = new ScrollMagic.Scene({
			triggerElement: slide,
			triggerHook: 0.25,
			reverse: false,
		})
			.setTween(slideT1)
			.addTo(controller);

		//GSAP Page Timeline
		const PageT1 = gsap.timeline();
		const nextSlide = slides.length - 1 === index ? 'end' : slides[index + 1];
		PageT1.fromTo(nextSlide, { y: '0%' }, { y: '50%' });
		PageT1.fromTo(slide, { opacity: 1, scale: 1 }, { opacity: 0, scale: 0.75 });
		PageT1.fromTo(nextSlide, { y: '50%' }, { y: '0%' }, '-=0.5');

		//Creating Page Scene
		pageScene = new ScrollMagic.Scene({
			triggerElement: slide,
			duration: '100%',
			triggerHook: 0,
		})
			.setPin(slide, { pushFollowers: false })
			.setTween(PageT1)
			.addTo(controller);
	});
};
const animateNav = () => {
	gsap.fromTo(
		'.nav-header',
		1,
		{ y: '-100%', left: '7.5%' },
		{ y: '0%', position: 'fixed', left: '7.5%' }
	);
};

const mouse = document.querySelector('.cursor');
const mouseText = mouse.querySelector('.cursor-text');
const burger = document.querySelector('.burger');

const cursor = (e) => {
	mouse.style.top = e.pageY + 'px';
	mouse.style.left = e.pageX + 'px';
};

const cursorOnTop = (e) => {
	if (e.target.id === 'logo' || e.target.classList.contains('burger')) {
		mouse.classList.add('mouse-active');
	} else if (e.target.classList.contains('explore')) {
		mouse.classList.add('mouse-explore');
		mouseText.innerText = 'Tap';
		gsap.to('.title-swipe', 1.5, { y: '0%' });
	} else {
		mouse.classList.remove('mouse-active');
		mouse.classList.remove('mouse-explore');
		mouseText.innerText = '';
		gsap.to('.title-swipe', 1.5, { y: '100%' });
	}
};

const navToggle = (burger) => {
	if (!burger.classList.contains('active')) {
		burger.classList.add('active');
		gsap.to('.line1', 0.75, { rotate: '45', y: 5, background: 'black' });
		gsap.to('.line2', 0.75, { rotate: '-45', y: -2, background: 'black' });
		gsap.to('#logo', 1, { color: 'black' });
		gsap.to('.nav-bar', 1.25, { clipPath: 'circle(200% at 100% -10%)' });
		document.body.classList.add('hide');
	} else {
		burger.classList.remove('active');
		gsap.to('.line1', 0.75, { rotate: '0', y: 0, background: 'white' });
		gsap.to('.line2', 0.75, { rotate: '0', y: 0, background: 'white' });
		gsap.to('#logo', 1, { color: 'white' });
		gsap.to('.nav-bar', 1, { clipPath: 'circle(1% at 100% -10%)' });
		document.body.classList.remove('hide');
	}
};

//Barba Page Transition
const logo = document.querySelector('#logo');
const navItems = document.querySelectorAll('.nav-links a');

barba.init({
	views: [
		{
			namespace: 'home',
			beforeEnter() {
				animationSlide();
				animateNav();
				logo.href = './index.html';
				navItems[0].href = '#home';
				navItems[1].href = '#about';
				navItems[2].href = '#fashion';
				navItems[3].href = './fashion/index.html';
			},
			beforeLeave() {
				slideScene.destroy();
				pageScene.destroy();
				controller.destroy();
			},
		},
		{
			namespace: 'fashion',
			beforeEnter() {
				animateNav();
				logo.href = '../index.html';
				navItems[0].href = `../index.html#home`;
				navItems[1].href = `../index.html#about`;
				navItems[2].href = `../index.html#fashion`;
				navItems[3].href = `./index.html`;
			},
		},
	],
	transitions: [
		{
			leave(data) {
				let done = this.async();
				const t1 = gsap.timeline({ defaults: { ease: 'power2.inOut' } });
				t1.fromTo(data.current.container, 1, { opacity: 1 }, { opacity: 0 });
				t1.fromTo(
					'.swipe',
					1,
					{ x: '-100%' },
					{ x: '0%', onComplete: done },
					'-=0.5'
				);
			},
			enter(data) {
				let done = this.async();
				window.scrollTo(0, 0);
				const t1 = gsap.timeline({ defaults: { ease: 'power2.inOut' } });
				t1.fromTo(
					'.swipe',
					1,
					{ x: '0%' },
					{ x: '100%', stagger: 0.25, onComplete: done }
				);
				t1.fromTo(data.next.container, 1, { opacity: 0 }, { opacity: 1 });
			},
		},
	],
});

//Event Listeners
burger.addEventListener('click', () => {
	navToggle(burger);
});
window.addEventListener('mousemove', cursor);
window.addEventListener('mouseover', cursorOnTop);
navItems.forEach((navItem) => {
	navItem.addEventListener('click', () => {
		navToggle(burger);
	});
});
