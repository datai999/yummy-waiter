declare module 'myTable' {
    type Table = {
        id: string;
        status: TableStatus;
        orderTime: Date | null;
        timer: number;
        bags: Map<number, SelectedItem>;
    }
}

module.exports = {
    Table
};