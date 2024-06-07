
import './App.css'

import { Routes, Route, Outlet, Link } from "react-router-dom";
import { Container, Navbar, Spinner} from 'react-bootstrap'
import { useEffect, useState } from 'react';
//fetchData
//import {  } from "./fetchData.tsx";
import * as fetchData from "./fetchData";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Modal from 'react-bootstrap/Modal';

import Nav from 'react-bootstrap/Nav';

////function numberWithCommas(x: Number) {
//  var parts = x.toFixed(2).split(".");
//  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
//  return parts.join(".");
//}





function App() {


  return (
    <>
    <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          {/* Using path="*"" means "match anything", so this route
                acts like a catch-all for URLs that we don't have explicit
                routes for. */}
          <Route path="*" element={<NoMatch />} />
        </Route>
      </Routes>

    </>
  )
}

function Layout() {

  //Show
  const [show, setShow] = useState(true);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div>
      {/* A "layout route" is a good place to put markup you want to
          share across all the pages on your site, like navigation. 
          <Nav.Link><Link to="/nothing-here" style={{ textDecoration: 'none' }}>Nothing Here</Link></Nav.Link>*/}
      
      <Navbar data-bs-theme="dark" className="bg-body-tertiary">
      <Container>
      <Navbar.Brand href="/">Ton Hot Shot</Navbar.Brand> 
      <Nav className="me-auto">
            <Nav.Link onClick={handleShow}>[how it works]</Nav.Link>
      </Nav>
          
      </Container>
    </Navbar>

      {/* An <Outlet> renders whatever child route is currently active,
          so you can think about this <Outlet> as a placeholder for
          the child routes we defined above. */}
      <Outlet />

    
    <Modal show={show} onHide={handleClose} data-bs-theme="dark">
        <Modal.Header closeButton>
          <Modal.Title className="text-white">How it works</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-white">
        <p>Hotshot shows pumps of memecoin on stonfi! First it loads all the pools and find king of the hill = biggest pool by TVL below 60k$. When is starts to inspect every block to find new pumps and dumps of memecoins on stonfi!
        </p>
        <p>Frequent occurrences of memcoin buying or selling can tell you its popularity!</p>
        <p>Double-click on the card and you will be redirected to the token purchase page</p>
        </Modal.Body>
        <Modal.Footer>
        <Container fluid className="py-4 text-center">
          <a className="text-white" onClick={handleClose}>[I'm ready to pump]</a>
        </Container>
        </Modal.Footer>
      </Modal>


    
    </div>
  );
}

function Home() {
  // Start
  const [data, setData] = useState<fetchData.startRes | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  // TICK
  const [,settickData] = useState<fetchData.tickRes | undefined>(undefined);
  const [,settickLoading]  = useState(true);

  //table tick
  const [pumpdata,setpumpData] = useState<fetchData.PumpData[] | undefined>(undefined);


  //sleep
  const sleep = (time: number) =>
  new Promise((resolve) => setTimeout(resolve,time));



      // useEffect with an empty dependency array works the same way as componentDidMount
  useEffect(() => {
    try {
      //var pumpSum =[] as fetchData.PumpData[];
      async function getStart() {
      // set loading to true before calling API
        setLoading(true);
          //console.log(loading);
          //const data = fetchData() as richArr;
          //setData(data);
        (async () => {
          var pumpdata = [] as fetchData.PumpData[];
          const data = await fetchData.startData();
          setData(data);
           // switch loading to false after fetch is complete
          setLoading(false);
          console.log('Прошли loading');
          //var tickdata :fetchData.PumpData[] ;
          //await sleep(5000);
                  //здесь пили тик запрос и зацкиливаем его
        async function getTick(ltb: number, blk_list: fetchData.tempDict[]) {
          
          settickLoading(true);
          
          const tickdata = await fetchData.tickData(ltb,blk_list);
          
          var ltb_new = tickdata.lastest_block
          if(pumpdata.length===0){
            //console.log('занулились');
            pumpdata = tickdata.pump_list;
          } else {
            //console.log('конкатнули');
            //pumpdata = pumpdata.concat(tickdata.pump_list);
            pumpdata = tickdata.pump_list.concat(pumpdata);
          }
        // здесь нужен мехнанизм append
          //pumpdata?.concat(tickdata.pump_list)
          //console.log('тут')
          console.log('Сумматор',pumpdata.length)
          setpumpData(pumpdata);
          //setpumpData(pumpdata.concat(tickdata.pump_list))
          settickData(tickdata);
          // switch loading to false after fetch is complete
          settickLoading(false);
          
          
   
          await sleep(1100);
          await getTick(ltb_new,blk_list);
          //await sleep(1000);
        }
        


        getTick(data?.lastest_block!, data?.block_list!);

        })();

        //здесь пили тик запрос и зацкиливаем его
        //async function getTick(ltb: number, blk_list: fetchData.tempDict[]) {
          
        //  settickLoading(true);
          
        //  const tickdata = await fetchData.tickData(ltb,blk_list);
          
        //  var ltb_new = tickdata.lastest_block
        //  settickData(tickdata);
          // switch loading to false after fetch is complete
       //   settickLoading(false);
          

        //  getTick(ltb_new,blk_list)
        //}
       //console.log("in useeffect",data?.lastest_block!);
       // getTick(data?.lastest_block!, data?.block_list!);
      }
      getStart();
          
    } catch (error) {
          // add error handling here
      setLoading(false);
      console.log(error);
    }
  }, []);
   



    // return a Spinner when loading is true
  if(loading) return (
        <div className="vh-100 bg-dark">
            <Container fluid className="py-4 text-center" data-bs-theme="dark">
            <p style={{ fontSize: "30px", fontWeight: "190"  }} className="text-white">Loading data...</p>
            <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Loading...</span>
            </Spinner>
            <p className="text-secondary">TON HOT SHOT - collects data in live mode, wait 20 seconds</p>
          </Container>
        </div>
    
  );
  
    // data will be null when fetch call fails
  if (!data) {
      return (
        <div className="vh-100 bg-dark">
            <Container fluid className="py-4 text-center" data-bs-theme="dark">
            <h1 style={{ fontSize: "30px", fontWeight: "175"  }} className="text-white">An error occurred while loading data, if you want to report it, write in the comments <a href="https://t.me/ton_learn">here</a>.</h1>
          </Container>
          </div>
    );
  }  



  //console.log(data.king_dict);
  //var king_dict_html=<p className="text-white">King dict Name {data.king_dict.name} </p>
  var king_dict_link = data.king_dict.stonfi_link
  var king_dict_image = data.king_dict.image_url
  var king_dict_name = data.king_dict.name
  //var king_dict_desc = data.king_dict.description
  var king_dict_ticker = data.king_dict.symbol
  var king_dict_lp_total_supply_usd = data.king_dict.lp_total_supply_usd

  //<Card.Text className="mb-2" word-break="break-all">
  //                                Description: {king_dict_desc}  </Card.Text>      

  const tableRows = pumpdata?.map((row: fetchData.PumpData,index) => {
    
    return (
      <Col xs="12" md="4">

    <Card as="a" href={row.stonfi_link} style={{ textDecoration: 'none'}} className= {index +" mb-3"} target="_blank" rel="noopener noreferrer"> 
                <Row >            
                    <Col  xs="6" sm="4">              
                        <Card.Img variant="top" src={row.image_url == null ? "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg" : row.image_url} /> 
                    </Col>            
                    <Col>              
                        <Card.Body id="text">                
                            <Card.Title className="font-weight-bold">{row.name}                
                            </Card.Title>  
                            <Card.Subtitle><span style={{color: row.type === 'BUY' ? "#15a272" : "#e53843"}} >{row.type}</span >: {Number(row.price).toFixed(4)} TON  </Card.Subtitle>  
                            <Card.Subtitle>TVL: {Number(row.lp_total_supply_usd).toFixed(2)} USD</Card.Subtitle>  
                            <Card.Subtitle style={{ fontSize: "15px", fontWeight: "70" , wordBreak: "break-all", color: 'grey' }} className='p-1'>{row.name} [tikr: {row.symbol}]: {row.description}  </Card.Subtitle>             

                              
                        </Card.Body>            
                    </Col>          
                </Row>        
          
    </Card>

      </Col>
      // добавить обработки tickdata undedifined // {numberWithCommas(Number(row.balance)/1000000000)} TON
      //<Card.Link  href={king_dict_link} >   </Card.Link>  
      //<tr>
      //<td>{index+1}</td>
      //<td>{row.name}</td>
      //<td>{row.price}</td>
     //</tr>
     
    );
  });





  return (
    <div className="vh-100 bg-dark">
    <Container fluid className="py-1 text-center" data-bs-theme="dark">
    <br/>
    <a href="https://t.me/tonhotshot" style={{ fontSize: "25px", fontWeight: "250", textDecoration: 'none' }} className="text-white" target="_blank" rel="noopener noreferrer">[Start a new coin]</a>
    <p style={{ fontSize: "30px", fontWeight: "600"  }} className="text-white">King of the hill</p>
    <Row>
        <Col></Col>
        <Col xs="12" md="4">

    <Card as="a" href={king_dict_link} style={{ textDecoration: 'none'}} className="mb-3" target="_blank" rel="noopener noreferrer"> 
            
                    <Row id="row">            
                        <Col id="image" xs="6" sm="4">              
                            <Card.Img variant="top" src={king_dict_image === null ? "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg" : king_dict_image } /> 
                        </Col>            
                        <Col>              
                            <Card.Body id="text">                
                                <Card.Title className="font-weight-bold">{king_dict_name}                
                                </Card.Title>   
                                <Card.Subtitle>{king_dict_name} [tikr: {king_dict_ticker}] </Card.Subtitle> 
                                <br />            
                                <Card.Subtitle>TVL: {Number(king_dict_lp_total_supply_usd).toFixed(2)} USD</Card.Subtitle>     
                            </Card.Body>            
                        </Col>          
                    </Row>        
               
    </Card>
      
    </Col>
    <Col></Col>
    </Row>
    </Container >
    <Container  fluid className="py-4 text-center" data-bs-theme="dark">
    <p style={{ fontSize: "25px", fontWeight: "190"  }} className="text-white">Memecoin Terminal</p> 
    <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Loading...</span>
    </Spinner>
    <p className="text-secondary">Scannin every blck for Memecoin on TON! - W8t 5 second and new memecoin will apear</p>
  </Container >

  <Container data-bs-theme="dark">
    <Row>
      {tableRows}
    </Row>
  </Container>
        
 
  <Container fluid className="py-4 text-center" data-bs-theme="dark">
  <p style={{ fontSize: "25px", fontWeight: "190"  }} className="text-white">Discover TON Insights You Can't Get Anywhere Else</p>
  <br /> 
  <p style={{ fontSize: "20px", fontWeight: "190"  }} className="text-white"> See what memecoins are skyrocketing and make your 10X. More <a href="https://t.me/ton_learn">here</a></p>
  </Container>

</div>



  );
}



function NoMatch() {
  return (
    <div className="vh-100 bg-dark">
    <Container fluid className="py-4 text-center" data-bs-theme="dark">
  <h1 style={{ fontSize: "30px", fontWeight: "175"  }} className="text-white">This is a 404 page, go to our home page or our <a href="https://t.me/ton_learn">community</a></h1>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
  </Container>
  </div>
  
  );
}


export default App


import 'bootstrap/dist/css/bootstrap.min.css';

