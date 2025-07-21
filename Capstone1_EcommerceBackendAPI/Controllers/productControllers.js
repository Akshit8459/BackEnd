const db=require('../Models/Products');

exports.getAllProducts = async (req, res) => {
    try {
        const products = await db.find();

        if (!products || products.length === 0) {
            return res.status(200).send(`
                <html>
                    <body>
                        <h2>No products were found.</h2>
                        <a href="/products/create"><button>Create Product</button></a>
                    </body>
                </html>
            `);
        }

        const productHTML = products.map(p => `
            <div class="product">
                <h3>${p.name}</h3>
                <p><strong>Id:</strong> ${p._id}</p>
                <p><strong>Price:</strong> ₹${p.price}</p>
                <p><strong>Category:</strong> ${p.category}</p>
                <p><strong>Stock:</strong> ${p.stock}</p>
                <div class="buttons">
                    <form action="/products/${p._id}?_method=DELETE" method="POST">
                        <button class="delete">Delete</button>
                    </form>
                    <form action="/products/${p._id}" method="GET">
                        <button class="update">Update</button>
                    </form>
                    <form action="/cart/add/${p._id}" method="POST">
                        <button class="add-cart">Add to Cart</button>
                    </form>
                    <form action="/orders" method="POST">
                        <input type="hidden" name="product" value="${p._id}">
                        <input type="hidden" name="quantity" value="1">
                        <input type="hidden" name="price" value="${p.price}">
                        <input type="hidden" name="shippingAddress" value="${"HOME"}">
                        <button class="add-cart">Buy Now</button>
                    </form>
                </div>
            </div>
        `).join("");

        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Product List</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        padding: 20px;
                        background-color: #f4f4f4;
                    }
                    h1 {
                        text-align: center;
                        margin-bottom: 20px;
                    }
                    .top-bar {
                        text-align: center;
                        margin-bottom: 30px;
                    }
                    .top-bar a button {
                        background-color: #28a745;
                        color: white;
                        border: none;
                        padding: 10px 20px;
                        font-size: 1em;
                        border-radius: 5px;
                        cursor: pointer;
                    }
                    .product-list {
                        display: grid;
                        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                        gap: 20px;
                    }
                    .product {
                        background: white;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0 0 10px rgba(0,0,0,0.1);
                    }
                    .buttons {
                        display: flex;
                        flex-wrap: wrap;
                        gap: 8px;
                        margin-top: 12px;
                    }
                    .buttons button {
                        flex: 1 1 45%;
                        padding: 8px;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 0.85em;
                    }
                    .delete   { background-color: #ff4d4d; color: white; }
                    .update   { background-color: #ffa500; color: white; }
                    .add-cart { background-color: #007bff; color: white; }
                </style>
            </head>
            <body>
                <h1>Our Products</h1>
                <div class="top-bar">
                    <a href="/products/create"><button>Create Product</button></a>
                </div>
                <div class="product-list">
                    ${productHTML}
                </div>
            </body>
            </html>
        `;

        return res.status(200).send(html);
    } catch (e) {
        console.error("Error while fetching products:", e.message);
        return res.status(500).send(`
            <html><body><h2>Internal Server Error</h2><p>${e.message}</p></body></html>
        `);
    }
};

exports.getProductEditPage = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await db.findById(id);
    if (!product) return res.status(404).send("Product not found");

    // Create and send the HTML directly
    return res.send(`
      <html>
        <head>
          <title>Edit Product</title>
          <style>
            body {
              font-family: Arial;
              max-width: 600px;
              margin: auto;
              padding: 20px;
            }
            h2 {
              text-align: center;
            }
            .product-details, form {
              border: 1px solid #ccc;
              padding: 20px;
              margin-top: 20px;
              border-radius: 8px;
              background: #f9f9f9;
            }
            label {
              display: block;
              margin-top: 10px;
              font-weight: bold;
            }
            input, textarea {
              width: 100%;
              padding: 8px;
              margin-top: 5px;
              border-radius: 4px;
              border: 1px solid #aaa;
            }
            button {
              margin-top: 20px;
              padding: 10px 20px;
              background-color: #007BFF;
              color: white;
              border: none;
              border-radius: 5px;
              cursor: pointer;
            }
          </style>
        </head>
        <body>
          <h2>Edit Product</h2>

          <div class="product-details">
            <h3>${product.name}</h3>
            <p><strong>Description:</strong> ${product.description}</p>
            <p><strong>Price:</strong> ₹${product.price}</p>
            <p><strong>Category:</strong> ${product.category}</p>
            <p><strong>Stock:</strong> ${product.stock}</p>
            ${product.images.length > 0 ? `<img src="${product.images[0]}" width="100" />` : ""}
          </div>

          <form action="/products/${product._id}?_method=PUT" method="POST">
            <label>Name</label>
            <input name="name" value="${product.name}" required>

            <label>Description</label>
            <textarea name="description" required>${product.description}</textarea>

            <label>Price</label>
            <input type="number" name="price" value="${product.price}" required>

            <label>Category</label>
            <input name="category" value="${product.category}" required>

            <label>Stock</label>
            <input type="number" name="stock" value="${product.stock}" required>

            <label>Images (comma-separated URLs)</label>
            <input name="images" value="${product.images.join(",")}" >

            <button type="submit">Update Product</button>
          </form>
        </body>
      </html>
    `);
  } catch (e) {
    console.log("Error while rendering product edit page:", e.message);
    return res.status(500).send("Internal server error");
  }
};


exports.createProduct=async (req,res)=>{
    try{
        const {name,description,price,category,stock,images}= req.body;
        const data={name,description,price,category,stock,images};
        const product = await db.create(data);
        if(!product) return res.json({message:"Error while creating this product"});
        return res.status(200).redirect('/products/');
    }catch(e){
        console.log("Error while adding product",e.message);
        return res.status(400).json({message:"Error while adding product",error:e.message});
    }
}

exports.updateProduct=async (req,res)=>{
    try{
        const id=req.params.id;
        const {name,description,price,category,stock,images}=req.body;
        let data={};
        if(name!=null) data.name=name;
        if(description!=null) data={...data,description};
        if(price!=null) data={...data,price};
        if(category!=null) data.category=category;
        if(stock!=null) data.stock=stock;
        if(images!=null) data.images=images;
        data.updatedAt=Date.now();
        console.log(data);
        const product=await db.findByIdAndUpdate(id, {$set:data},{new:true});
        return res.status(200).json({message:"Updation Success",product:product});
    }catch(e){
        console.log("Can't Update the user:",e.message);
        return res.status(400).json({message:"Error while updating the product",error:e.message});
    }
}

exports.deleteProduct=async (req,res)=>{
    try{
        const id=req.params.id;
        const product=await db.findByIdAndDelete(id);
        if(!product) return res.status(400).send("Product with this id doesn't exist");
        return res.status(200).redirect('/products/')
    }
    catch(e){
        console.log("Error while deleting the product",e.message);
        return res.status(404).json({message:"Error while deleting the product",error:e.message});
    }
}