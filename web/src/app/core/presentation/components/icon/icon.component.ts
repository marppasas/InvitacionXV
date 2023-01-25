import { Component, Input } from "@angular/core";
import { IconDefinition, RotateProp } from "@fortawesome/fontawesome-svg-core";
import { faBlackTie, faGithub, faInstagram, faLinkedin, faUps } from "@fortawesome/free-brands-svg-icons";
import { faBriefcase, faBus, faCar, faGift, faGifts, faGlassCheers, faLocationArrow, faMap, faMapMarked, faNetworkWired, faVest, faWineGlass } from "@fortawesome/free-solid-svg-icons";

@Component({
    selector: 'app-icon',
    template: '<fa-icon [icon]=_icon [rotate]="rotate"></fa-icon>',
})
export class IconComponent {
    @Input() icon: string;
    @Input() rotate: RotateProp | undefined = undefined;

    get _icon(): IconDefinition {
        switch(this.icon) {
            case 'party': return faWineGlass;
            case 'map': return faMapMarked;
            case 'dress': return faVest;
            case 'marker': return faLocationArrow;
            case 'bus': return faCar;
            case 'instagram': return faInstagram;
            case 'gifts': return faGifts;
            case 'gift': return faGift;
            case 'linkedin': return faLinkedin;
            case 'github': return faGithub;
            case 'briefcase': return faBriefcase;
            default:
                throw new Error(`${this.icon} icon does not exists`);
        }
    }
}