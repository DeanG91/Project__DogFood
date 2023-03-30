import React from "react";
import { TMyUser } from "./types";



export const TsExample = () => {





    const MyUser: TMyUser = {
        name: 'Alalala',
        avatar: '21313',
        phone: "+7892178",
        role: 'Agency'
    };

    let myName: string | number = 'srt';
    let myName2: boolean = true;


    type StringOrNumber = string | number | boolean

    const strorNumber: StringOrNumber = 2

    interface myInterface {
        name: StringOrNumber,
        avatar: string,
    }

    const myFunc = (n: number, message?: string): number | string => {
        console.log(message);

        if (message) {
            return message
        }

        return n + 2;
    }

    myFunc(2);

    const noValueFunc = (arg): void => {
        console.log('22');
    }

    const res = noValueFunc('arg');
    console.log({ res });


    console.log({ MyUser });

    type TName = {
        name:  [1, 2, 3, 4, 'asd', { name: 'asd' }]
    }

    type TsArr = number | string | TName;

    const tsArr: TsArr[] = [1, 2, 3, 4, 'asd']
    const tsArr2: Array<TsArr>= [1, 2, 3, 4, 'asd', { name:  [1, 2, 3, 4, 'asd', { name: 'asd' }] }]

    console.log(tsArr, tsArr2);


    // keyof typeof
    return <div></div>;
};
