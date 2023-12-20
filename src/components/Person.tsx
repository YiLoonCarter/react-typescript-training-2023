interface Props {
    name: string;
    email: string;
    age: number;
    isMarried: boolean;
    friends: string[];
    country: Country;
}

export enum Country {
    Malaysia = "Malaysia",
    Singapore = "Singapore",
    Japan = "Japan",
}

export const Person = (props: Props) => {
    return (
      <div>
        <h1>Name : {props.name}</h1>
        <h1>Email : {props.email}</h1>
        <h1>Age : {props.age}</h1>
        <h1>This person {props.isMarried ? "is" : "is not"} Married</h1>
        <h1>Friends List : </h1>
        {props.friends.map((friend: string, key) => (
            <h1>{key + 1} : {friend}</h1>
        ))}
        <h1>Country : {props.country}</h1>
      </div>
    );
}