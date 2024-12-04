declare module 'myTypes' {
    type Pho = {
        meats: string[],
        noodle: string,
        preferences?: string[],
        notes?: string,
    };

    type SelectedItem = {
        id: number,
        category: string,
        pho: Pho
    };
}

module.exports = {
    Pho,
    SelectedItem,
};