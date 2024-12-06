declare module 'myTypes' {
    type Pho = {
        id?: string,
        meats: string[],
        noodle: string,
        preferences?: string[],
        note?: string,
    };

    type PhoCode = {
        id?: string,
        meats: string,
        noodle: string,
        preferences?: string,
        note?: string,
    };

    type SelectedItem = {
        beef: Pho[],
        chicken: Pho[]
    };
}

module.exports = {
    Pho,
    PhoCode,
    SelectedItem,
};