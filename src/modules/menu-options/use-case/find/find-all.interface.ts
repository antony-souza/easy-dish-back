export interface ISubMenuOption {
    id: string;
    title: string;
    path: string;
    icon: string;
}

export interface IMenuOption {
    id: string;
    title: string;
    path: string;
    icon: string;
    subMenuOptions: ISubMenuOption[];
}
