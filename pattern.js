function printPyramid(){
let rows =5;
for (let i=1; i<=rows;i++);{
	let spaces=" ".repeat(rows-i);
    let stars= "*".repeat (2 * i-1);
    console.log(spaces + stars);
}
}
printPyramid();
