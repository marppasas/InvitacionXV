import { Component, EventEmitter, Input, Output } from "@angular/core";

export interface Tag {
    displayText: string;
    value: boolean;
}

@Component({
    selector: 'app-tag-selector',
    templateUrl: './tag-selector.component.html',
    styleUrls: [ './tag-selector.component.scss' ]
})
export class TagSelectorComponent {

    private _tags: string[];
    @Input() set tags(t: string[]) {
        this._tags = t;
        this.buildTags(t);
    }

    @Output() public tagClicked: EventEmitter<Tag> = new EventEmitter();

    public tagSelection: Tag[];

    public onTagClicked(tag: Tag): void {
        tag.value = !tag.value;
        this.tagClicked.emit(tag);
    }

    private buildTags(arr: string[]): void {
        this.tagSelection = [];
        for (let tag of arr) {
            this.tagSelection.push({
                displayText: tag,
                value: false,
            });
        }
    }

}