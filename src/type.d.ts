declare module 'myTypes' {
    type Pho = {
        meat: string,
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