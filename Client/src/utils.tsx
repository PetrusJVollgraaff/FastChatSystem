export function checkEmpty (value){
    const regex = /^\s*$/;
    return regex.test(value); 
}
