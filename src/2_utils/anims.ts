import { gsap } from 'gsap';

export function generateAnims(inVars: gsap.TweenVars, outVars: gsap.TweenVars) {
  const animSetup = (el: Element) => gsap.set(el, outVars);

  const animIn = (el: Element, done?: gsap.Callback) =>
    gsap.to(el, {
      ...inVars,
      duration: 0.15,
      ease: 'power2.out',
      onComplete: done,
    });

  const animOut = (el: Element, done?: gsap.Callback) =>
    gsap.to(el, {
      ...outVars,
      duration: 0.1,
      ease: 'power1.in',
      onComplete: done,
    });

  return [animSetup, animIn, animOut];
}
