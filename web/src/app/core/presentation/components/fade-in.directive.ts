import { Directive, ElementRef, OnInit } from "@angular/core";

@Directive({
    selector: '[fade-in]'
})
export class FadeInDirective implements OnInit {

    private elem: HTMLElement;

    private styles = {
        shown: {
            transform: 'translateY(0)',
            opacity: '1',
        },
        hidden: {
            transform: 'translateY(16px)',
            opacity: '0',
        }
    }

    constructor(
        el: ElementRef,
    ) {
        this.elem = el.nativeElement;
    }

    public ngOnInit(): void {
        this.elem.style.transition = 'all .5s';
        this.elem.style.transform = 'translateY(16px)';
        this.elem.style.opacity = '0';

        window.addEventListener("scroll", () => this.fadeIn());
        window.addEventListener("load", () => this.fadeIn());
    }

    private fadeIn(): void {
        let windowHeight = window.innerHeight;
        let elementTop = this.elem.getBoundingClientRect().top;
        if (elementTop < windowHeight - 50) {
            this.setStyles('shown');
        } else {
            this.setStyles('hidden');
        }
    }

    private setStyles(which: 'shown' | 'hidden'): void {
        for (let key in this.styles[which]) {
            this.elem.style[key] = this.styles[which][key];
        }
    }

}