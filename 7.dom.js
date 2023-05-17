
// macOS: Cmd + Option + L

// 밋집지도강의 4.2 : 이벤트 처리 //
// const myText = document.getElementById('myText');
//
// myText.addEventListener('mouseover', () => {
//     alert('문자열을 클릭했어요!');
// });


// 밋집지도강의 4.1 : querySelector, createElement, AppendChild 사용법
//
// const productsData = [
//   { title: "감자칩", weight: 300 },
//   { title: "칙촉", weight: 100 },
//   { title: "고구마칩", weight: 300 },
//   { title: "오잉", weight: 50 },
// ];
//
// const container = document.querySelector(".container");
//
// // Create a new element for the list
// const productList = document.createElement("ul");
// productList.classList.add("products");
//
// // Iterate through the productsData array
// productsData.forEach((product) => {
//   // Create a new list item for each product
//   const listItem = document.createElement("li");
//
//   // Set the content of the list item using a template literal
//   listItem.innerHTML = `
//     <div class="product">
//       <h3>${product.title}</h3>
//       <p>Weight: ${product.weight}g</p>
//     </div>
//   `;
//
//   // Append the list item to the productList
//   productList.appendChild(listItem);
// });
//
// // Insert the productList into the container or another desired location in the DOM
// container.appendChild(productList);


// const container = document.querySelector(".container");
// // Select the second 'item' class element inside the 'inner second' class element
// const secondItem = container.querySelector(".inner.second .item:nth-child(2)");
//
// // Set the content of the second item using a template literal
// secondItem.innerHTML = `
//   <div class="product">
//     <h3>Title: ${productsData.title}</h3>
//     <p>Weight: ${productsData.weight}g</p>
//   </div>
// `;
