import { gsap } from 'gsap';

export function generateAnims(inVars: gsap.TweenVars, outVars: gsap.TweenVars) {
  const setup = (el: Element) => gsap.set(el, outVars);

  const enter = (el: Element, done?: gsap.Callback) =>
    gsap.timeline({ onComplete: done }).to(el, {
      ...inVars,
      duration: 0.15,
      ease: 'power2.out',
    });

  const leave = (el: Element, done?: gsap.Callback) =>
    gsap.timeline({ onComplete: done }).to(el, {
      ...outVars,
      duration: 0.1,
      ease: 'power1.in',
    });

  return { setup, enter, leave };
}
