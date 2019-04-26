import { trigger, state, style, transition, animate, keyframes } from "@angular/animations";

// export const OPEN_CLOSE_MENU = trigger('openClose', [
//     state('open',   style({ 'display': 'block' })),
//     state('closed', style({ 'display': 'none' })),

//     transition('open => closed', animate('400ms ease-in-out', keyframes([
//         style({ 'display': 'block', 'width': '*', offset: 0 }),
//         style({ 'display': 'block', 'width': '0px', offset: 0.99 }),
//         style({ 'display': 'none', 'width': '0px', offset: 1 })
//     ]))),

//     transition('closed => open', animate('400ms ease-in-out', keyframes([
//         style({ 'display': 'none', 'width': '0px', offset: 0 }),
//         style({ 'display': 'block', 'width': '0px', offset: 0.01 }),
//         style({ 'display': 'block', 'width': '*', offset: 1 })
//     ])))
// ]);

export const OPEN_CLOSE_MENU = trigger('openClose', [
    transition(':enter', animate('400ms ease-in-out', keyframes([
        style({ 'display': 'none', 'width': '0px', offset: 0 }),
        style({ 'display': 'block', 'width': '0px', offset: 0.01 }),
        style({ 'display': 'block', 'width': '*', offset: 1 })
    ]))),

    transition(':leave', animate('400ms ease-in-out', keyframes([
        style({ 'display': 'block', 'width': '*', offset: 0 }),
        style({ 'display': 'block', 'width': '0px', offset: 0.99 }),
        style({ 'display': 'none', 'width': '0px', offset: 1 })
    ]))),
]);

export const OPEN_CLOSE_MENU_BODY = trigger('openCloseBody', [
    state('sbs', style({ 'margin-left': '250px' })),
    state('full', style({ 'margin-left': '0px' })),

    transition('sbs <=> full', animate('400ms ease-in-out'))
]);

export const FADE_IN_OUT = trigger('fade', [
    state(':enter', style({ display: 'none' })),
    state(':leave', style({ display: 'block' })),
    transition(':leave', animate('400ms ease-in-out', keyframes([
        style({ opacity: '*', display: 'block', offset: 0 }),
        style({ opacity: 0, display: 'block', offset: 0.99 }),
        style({ opacity: 0, display: 'none', offset: 1 })
    ]))),
    transition(':enter', animate('400ms ease-in-out', keyframes([
        style({ opacity: 0, display: 'block', offset: 0 }),
        style({ opacity: '*', display: 'block', offset: 1 })
    ])))
])