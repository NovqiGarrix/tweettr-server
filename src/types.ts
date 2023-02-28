interface User {
    username: string;
    name: string;
}

export interface Chat {
    user: User;
    tweet: string;
}

export interface SearchResponse {
    data: Array<SearchData>;
    meta: Meta;
    includes: Includes;
}

interface Includes {
    users: Array<User>;
}

export interface SearchData {
    text: string;
    author_id: string;
}

interface Meta {
    newest_id: string;
    oldest_id: string;
    result_count: number;
    next_token: string;
}