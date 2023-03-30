export type TMyUser = {
    name: string,
    avatar: string,
    phone: number | string,
    role: 'Admin' | 'User' | 'Agency',
    __v?: number
}