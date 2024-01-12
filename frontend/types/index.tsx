import { ReactNode } from "react";

export interface LayoutChildreProps{
    children?: ReactNode;
}

//bare progression
export interface ProgresionProps{
    isLoading: boolean;
    end: string;
    goal: string;
    totalCollected: string;
}

export interface ContributeProps{
    getDatas: ()=> void;
}

export interface ContributorsProps{
    events:Array<Contributor>
}

export interface refundProps{
    getDatas: () =>void;
    end: string;
    goal: string;
    totalCollected: string;
}

//pour setEvent de Pool.tsx
export interface Contributor{
    contributor :string;
    amount: string;
}