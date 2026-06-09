export type QiitaUser = {
    id: string;
    profile_image_url: string;
};

export type QiitaItem = {
    id: string;
    title: string;
    url: string;
    likes_count: number;
    created_at: string;
    tags: { name: string }[];
    user: QiitaUser;
};