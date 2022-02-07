import React, { useEffect, useState } from "react";
import { Alert, Card, Layout, Popover } from 'antd';
import { CaretDownOutlined, CloseSquareOutlined, PictureOutlined } from '@ant-design/icons';

const { Header, Content, Footer } = Layout;
const { Meta } = Card;

export default function Cart() {
    const [cartData, setCartData] = useState(() => {
        // getting stored value
        const savedCartData = localStorage.getItem("cartData");
        const initialValue = JSON.parse(savedCartData);
        return initialValue || [];
      });
      const [warning, setWarning] = useState(false);
      const [itemsCount, setItemsCount] = useState(0);
      const [totalAmount, setTotalAmount] = useState('');
      
    async function callCartApi () {
        return fetch('https://dnc0cmt2n557n.cloudfront.net/products.json')
          .then(res => res.json())
          .then(json => json)
      }
      const calcTotalAmount = (data) => data.reduce((accumulator, current) => accumulator + (current.updatePrice || parseInt(current.price)), 0)
      const calcItems = (data) => data.reduce((accumulator, current) => accumulator + (current.qty || 1), 0)

      useEffect(async ()=> {
          const storedCartData = localStorage.getItem('cartData');
          if(!storedCartData){
            const cartData = await callCartApi();
            const calcTotal = calcTotalAmount(cartData.products);
            const calcQty = calcItems(cartData.products);
            localStorage.setItem('cartData', JSON.stringify(cartData.products));
            setCartData (cartData.products);
            setTotalAmount(calcTotal);
            setItemsCount(calcQty);
          } else {
            const calcTotal = calcTotalAmount(JSON.parse(storedCartData));
            const calcQty = calcItems(JSON.parse(storedCartData));
            setCartData(JSON.parse(storedCartData));
            setTotalAmount(calcTotal);
            setItemsCount(calcQty);

          }
        
      },[]);

      const confirm = (id) => {
        // message.info(`Clicked on Yes. ${id}`);
        console.log("id before", id, cartData);
        let updateCartData = [...cartData];
        updateCartData.splice(updateCartData.findIndex(obj => obj.id == id), 1);
        console.log("id", updateCartData);
        localStorage.setItem('cartData', JSON.stringify(updateCartData));

        const calcTotal = calcTotalAmount(updateCartData);
        const calcQty = calcItems(updateCartData);
        setTotalAmount(calcTotal);
        setCartData (updateCartData);
        setItemsCount(calcQty);

      }


      const handleDecrement = (qty, id) => {
        const decQty = parseInt(qty) - 1;
        let updateCartData;
        if(decQty > 0) {
             updateCartData = cartData.map(obj =>
                obj.id == id ? { ...obj, qty: decQty, updatePrice: parseInt(obj.price) * decQty } : obj
            );
        } else {
            updateCartData = [...cartData];
            setWarning(true);
        }
        
        localStorage.setItem('cartData', JSON.stringify(updateCartData));
        const calcTotal = calcTotalAmount(updateCartData);
        const calcQty = calcItems(updateCartData);
        setTotalAmount(calcTotal);
        setCartData (updateCartData);
        setItemsCount(calcQty);

      }

      const handleIncrement = (qty, id) => {
        const incQty = parseInt(qty) + 1;
        const updateCartData = cartData.map(obj =>
            obj.id == id ? { ...obj, qty: incQty, updatePrice: parseInt(obj.price) * incQty } : obj
        );
        setWarning(false);
        const calcTotal = calcTotalAmount(updateCartData);
        const calcQty = calcItems(updateCartData);

        setTotalAmount(calcTotal);
        localStorage.setItem('cartData', JSON.stringify(updateCartData));
        setCartData (updateCartData);
        setItemsCount(calcQty);

    }
    const content = (
        <div className="mini-cart">
          {
              cartData.length  && cartData.map((product, i) => {
                  return (<Card key={product.id} hoverable>
                      <div className="f-left remove-icon"><CloseSquareOutlined onClick={()=>confirm(product.id)} /></div>
                  <Meta
                    avatar={<PictureOutlined />}
                    title={product.title}
                    description={`${product.currency} ${product.updatePrice || product.price}`}
                    className="f-left prod-details"
                  />
                  <div className="f-left qty">Qty {product.qty || '1'}</div>
                </Card>)
              })
          }
        </div>
      );
      
    return <Layout>
    <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
          <div className="logo">Simple Cart Application </div>
          <div className="cart-link">$ {totalAmount} <Popover placement="bottom" content={content} trigger="click" >
        <span style={{display: 'block', lineHeight: '0'}}>{itemsCount} items <CaretDownOutlined /></span>
      </Popover></div>
      
    </Header>
    <Content className="site-layout" style={{ padding: '0 50px', marginTop: 64 }}>
      <div style={{ margin: '16px 0' }}></div>
      <div className="site-layout-background" style={{ padding: 24, minHeight: 380 }}>
      {warning && <div style={{ maxHeight: 80, marginBottom: 20 }}>
          <Alert message="Minimum 1 item is required" type="warning" showIcon />
          </div>}
          {
              cartData.length  ? cartData.map((product, i) => {
                  return (<Card key={product.id} hoverable>
                  <Meta
                    avatar={<PictureOutlined />}
                    title={product.title}
                    description={product.desc}
                    className="f-left prod-details"
                  />
                  <div className="f-left qty"><button onClick={()=>handleDecrement(product.qty || '1', product.id)}>-</button> <input type="text" value={product.qty || '1'} /> <button onClick={()=>handleIncrement(product.qty || '1', product.id)}>+</button></div>
                  <div className="f-left price">{product.currency} {product.updatePrice || product.price}</div>
                </Card>)
              }) : <><div>Add items to cart..</div></>
          }
      
      </div>
    </Content>
    <Footer style={{ textAlign: 'center' }}> ©2022 simple cart application</Footer>
  </Layout>;
  }