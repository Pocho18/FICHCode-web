export type MenuType = null | "settings" | "archive" | "search" | "user"
export type HistoryType = {
    title: string,
    updatedAt?: number,
    createdAt?: number,
    content: string,
    id: string
}
export type TabType = {
    title: HistoryType['title'],
    id: HistoryType['id']
}