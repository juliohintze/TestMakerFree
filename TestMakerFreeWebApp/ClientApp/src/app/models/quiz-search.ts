export class QuizSearchRequest {
    title: string;
    orderBy: 'latest' | 'byTitle' | 'mostViewed';
    num: number;
    page: number;
    userId: string;

    constructor() {
        this.page = 1;
        this.num = 10;
        this.orderBy = 'latest';
    }
}