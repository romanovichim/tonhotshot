

//type PoolPrep ={
//	pool: PoolInfo;
//}
 
//type PoolInfo = {
//	id: string;
//	asset0Id: string;
//	asset1Id: string;
//	createdAtBlockNumber: number;
//	createdAtBlockTimestamp: number;
//	createdAtTxnId: string;
//	feeBps: number;
//};

type PoolPrep1 ={
	pool: PoolInfo1;
}
 
type PoolInfo1 = {
	address: string;
	router_address: string;
	reserve0: number;
	reserve1: number;
	token0_address: string;
	token1_address: string;
	lp_total_supply_usd: string;
};


//async function takePoolInfo(poolAddr: string): Promise<PoolInfo> {
//    const endpoint = `https://api.ston.fi/export/dexscreener/v1/pair/${poolAddr}`;
//   const response = await fetch(endpoint);
//    const data = await response.json() as PoolPrep;
//	//console.log(await data['pool']);
//    return data['pool'];
//}  

async function takePoolInfo1(poolAddr: string): Promise<PoolInfo1> {
    const endpoint = `https://api.ston.fi/v1/pools/${poolAddr}`;
    const response = await fetch(endpoint);
    const data = await response.json() as PoolPrep1;
	//console.log(await data['pool']);
    return data['pool'];
}  



type AssetPrep ={
	asset: TokenInfo;
}
 
interface TokenInfo {
    contract_address: string;
    symbol: string;
    display_name: string;
    priority: number;
    image_url: string;
    decimals: number;
    kind: string;
    deprecated: boolean;
    community: boolean;
    blacklisted: boolean;
    default_symbol: boolean;
    dex_usd_price: string;
    dex_price_usd: string;
}

//async function takeAssetInfo(assetAddr: string): Promise<TokenInfo> {
//    const endpoint = `https://api.ston.fi/export/dexscreener/v1/asset/${assetAddr}`;
//    const response = await fetch(endpoint);
//    const data = await response.json() as AssetPrep;
//	//console.log(await data['asset']);
//   return data['asset'];
//}  

async function takeAssetInfo(assetAddr: string): Promise<TokenInfo> {
    const endpoint = `https://api.ston.fi/v1/assets/${assetAddr}`;
    const response = await fetch(endpoint);
    const data = await response.json() as AssetPrep;
	//console.log('Came',await data['asset']);
    return data['asset'];
}  

type MasterPrep ={
	last: MasterInfo;
}

type MasterInfo = {
	seqno: number;
}


async function fastBlock(): Promise<number> {
	const endpoint = `https://toncenter.com/api/v3/masterchainInfo`;
    const response = await fetch(endpoint);
    const data = await response.json() as MasterPrep;
	return data.last.seqno
}



type statePrep ={
   data: data;
}

type data ={
   account_states: dtonArr;
}

type dtonArr = DtonInfo[];

type DtonInfo = { 
    name: string;
    image_url: string | null;
    symbol: string;
    description: string | null;
};

//Promise<DtonInfo>;
async function getJettonData(jetMasterAddr: string): Promise<DtonInfo> {
	// все таки доставать надо все кроме description bp https://api.ston.fi/swagger-ui/#/Dex/get_asset
	const assetInfo = await takeAssetInfo(jetMasterAddr) as TokenInfo;

	const endpoint = 'https://dton.io/graphql/'
	const template = `
	account_states(
	account: {address_friendly: "${jetMasterAddr}" }
	) {
	name: parsed_jetton_content_name_value
	image_url: parsed_jetton_content_image_value
	symbol: parsed_jetton_content_symbol_value
	description: parsed_jetton_content_description_value
	}
	`;

	const formatted = template.replace('${jt_m_addr}', jetMasterAddr);
	const formattedQuery = `{ ${formatted} }`;

	const response = await fetch(endpoint, {
	method: 'POST',
	headers: {
	'Content-Type': 'application/json',
	},
	body: JSON.stringify({ query: formattedQuery }),
	});

	const responseData = await response.json() as statePrep;
	
	
	//if (result.name === null) {
	//	const assetInfo = await takeAssetInfo(jetMasterAddr) as TokenInfo;
	//	return { name: assetInfo.name, image_url: null, symbol: assetInfo.symbol, description: null };
	//}
	if(responseData.data.account_states[0] === undefined){
		return {name: assetInfo.display_name, image_url: assetInfo.image_url, symbol: assetInfo.symbol, description: '' };
	} else {
		const description = responseData.data.account_states[0].description;
		return {name: assetInfo.display_name, image_url: assetInfo.image_url, symbol: assetInfo.symbol, description: description };
	}

	
}  
  
function createStonfiLink(token0: string, token1: string): string {
    // Consider scenarios for TON and token links
    const tt: string = token0 === 'EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c' ? 'TON' : token0;
    const ff: string = token1 === 'EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c' ? 'TON' : token1;
    const ref: string = 'EQAvmc9oVnOvLFlUAgeNmZNZoKeDg9vTEiAQxNFw-t5mh3m7';

    const stonfiLink: string = `https://app.ston.fi/swap?ft=${ff}&tt=${tt}&chartVisible=false&fa=10&referral_address=${ref}`;
    return stonfiLink;
} 
 

type statePool ={
   pool_list: PoolArr;
}

type PoolArr = PoolData[]; 
  
type PoolData = {
  address: string;
  router_address: string;
  reserve0: string;
  reserve1: string;
  token0_address: string;
  token1_address: string;
  lp_total_supply: string;
  lp_total_supply_usd: string;
  lp_fee: string;
  protocol_fee: string;
  ref_fee: string;
  protocol_fee_address: string;
  collected_token0_protocol_fee: string;
  collected_token1_protocol_fee: string;
  lp_price_usd: string;
  apy_1d: string;
  apy_7d: string;
  apy_30d: string;
  deprecated: boolean;
}

export type tempDict = {
	pool: string; 
	lp_total_supply_usd: string;
	token0_address: string;
	token1_address: string;
}

//interface BlockData {
//  block: {
//    blockNumber: number;
//    blockTimestamp: number;
//  };
//}
 
interface kingData {
  name: string;
  image_url: string;
  symbol: string;
  description: string;
  stonfi_link: string;
  lp_total_supply_usd: string;
}

export interface startRes {
	lastest_block: number;
	king_dict: kingData;
	block_list: tempDict[];
}
 
export async function startData(): Promise<startRes> {
	//console.log(await fastBlock());
	const endpoint = `https://api.ston.fi/v1/pools`;
    const response = await fetch(endpoint);
    const data = await response.json() as statePool;
	//console.log(data.pool_list[0]);
	const temp_arr: tempDict[] = []; // array of low cap
	const block_arr: tempDict[] = []; // array of high cap
	
	for (const jetton of data['pool_list']) {
    const temp_dict = {
      'pool': jetton['address'],
      'lp_total_supply_usd': parseFloat(jetton['lp_total_supply_usd']).toFixed(2),
      'token0_address': jetton['token0_address'],
      'token1_address': jetton['token1_address']
    };

    //if (jetton['token0_address'] === 'EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c' ||
    //   jetton['token1_address'] === 'EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c') {

	
      if (parseFloat(temp_dict['lp_total_supply_usd']) < 60000) {
		// здесь надо убрать все что не TON пулы
		if (temp_dict['token0_address'] === 'EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c' || temp_dict['token1_address'] === 'EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c') {
        	temp_arr.push(temp_dict);
		}
      } else {
        block_arr.push(temp_dict);
      }
    //}
	// убрать пул со scale вообще тут не нужен
	  if (temp_dict.pool=='EQAEQcxaAJNsp58SYTBJs9XkxXWZb-rFSoG9esDdCTz62kjm') {
		block_arr.push(temp_dict);	
	  }

	}

	const sr = temp_arr.sort((a, b) => Number(b['lp_total_supply_usd']) - Number(a['lp_total_supply_usd']));
	
	//const endpointl = `https://api.ston.fi/v1/screener/latest-block`;
    //const responsel = await fetch(endpointl);
    //const datal = await responsel.json() as BlockData;

	//const lastest_block = datal['block']['blockNumber'];
	const lastest_block = await fastBlock() - 2;
	
	if (sr[0]['token0_address'] == "EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c") {
		let temp_dict_king = await getJettonData(sr[0]['token1_address']);
		let king_dict = {name: temp_dict_king['name'],image_url: temp_dict_king['image_url'],symbol: temp_dict_king['symbol'],description: temp_dict_king['description'],stonfi_link: createStonfiLink(sr[0]['token0_address'], sr[0]['token1_address']),lp_total_supply_usd:sr[0]['lp_total_supply_usd']} as kingData
		return {"lastest_block": lastest_block ,"king_dict": king_dict,"block_list": block_arr}
	} else if (sr[0]['token1_address'] == "EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c") {
		let temp_dict_king = await getJettonData(sr[0]['token0_address']);
		let king_dict = {name: temp_dict_king['name'],image_url: temp_dict_king['image_url'],symbol: temp_dict_king['symbol'],description: temp_dict_king['description'],stonfi_link: createStonfiLink(sr[0]['token0_address'], sr[0]['token1_address']),lp_total_supply_usd:sr[0]['lp_total_supply_usd']} as kingData
		return {"lastest_block": lastest_block ,"king_dict": king_dict,"block_list": block_arr}
	} else {
		let temp_dict_king = await getJettonData(sr[0]['token1_address']);
		let king_dict = {name: temp_dict_king['name'],image_url: temp_dict_king['image_url'],symbol: temp_dict_king['symbol'],description: temp_dict_king['description'],stonfi_link: createStonfiLink(sr[0]['token0_address'], sr[0]['token1_address']),lp_total_supply_usd:sr[0]['lp_total_supply_usd']} as kingData
		return {"lastest_block": lastest_block ,"king_dict": king_dict,"block_list": block_arr}
	}


	
}


interface Reserve {
  asset0: string;
  asset1: string;
}

interface Block {
  blockNumber: number;
  blockTimestamp: number;
}

interface Event {
  block: Block;
  eventType: string;
  txnId: string;
  txnIndex: number;
  eventIndex: number;
  maker: string;
  pairId: string;
  amount0In: string;
  amount1Out: string;
  amount1In: string;
  amount0Out: string;
  priceNative: string;
  reserves: Reserve;
}

interface EventsResponse {
  events: Event[];
}

export interface PumpData {
	name: string;
	image_url: string | null; 
	symbol: string; 
	description: string | null; 
	type: string;
	price: string;
	stonfi_link: string;
	lp_total_supply_usd: string;
}


export interface tickRes {
	pump_list: PumpData[];
	lastest_block: number;
}


export async function tickData(start_block: number, block_list: tempDict[]): Promise<tickRes>{
	//const endpointl = `https://api.ston.fi/v1/screener/latest-block`;
    //const responsel = await fetch(endpointl);
    //const datal = await responsel.json() as BlockData;

	//const lastest_block = datal['block']['blockNumber'];
	const lastest_block = await fastBlock();
	console.log('asdasd',lastest_block);
	//console.log("in tick in func",start_block);
	const payload = { fromBlock: start_block.toString(), toBlock: lastest_block.toString() };
	console.log(payload)

	if(payload['fromBlock'] === payload['toBlock'] || payload['fromBlock'] > payload['toBlock']){
	//не меняем блок
		//console.log('не меняем');
		const sleep = (time: number) =>
			new Promise((resolve) => setTimeout(resolve,time));
		await sleep(2000);
		return {'pump_list': [],'lastest_block': start_block}
	} else 
	{
		const queryString = new URLSearchParams(payload).toString();
		
		const response = await fetch(`https://api.ston.fi/export/dexscreener/v1/events?${queryString}`);
		const data = await response.json() as EventsResponse;
		
		const blocker = block_list.map(d => d['pool']);
		const count_arr: Event[] = [];
		
		for (const item of data['events']) {
		if (item['eventType'] === 'swap') {
			if (!blocker.includes(item['pairId'])) {
			count_arr.push(item);
			}
		}
		}
		//console.log('Всего count_arr',count_arr.length);

		const pump_list: PumpData[] = [];
		
		for (const row of count_arr) {
			const pool_info: PoolInfo1 = await takePoolInfo1(row['pairId']);
			//console.log("pool: ",row['pairId'])
			//console.log(pool_info.asset0Id)
			//console.log(pool_info.asset1Id)
			if ("amount0In" in row && pool_info['token0_address'] === "EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c") {
				//console.log('amount0In0',parseFloat(row['amount0In']));
				if (parseFloat(row['amount0In']) > 0.1) {
					let temp_pump_dict = await getJettonData(pool_info['token1_address']); 
					let pump_dict = {name: temp_pump_dict["name"], image_url: temp_pump_dict["image_url"],symbol: temp_pump_dict["symbol"], description: temp_pump_dict["description"],type: "BUY",price: row['amount0In'],stonfi_link: createStonfiLink(pool_info['token1_address'], pool_info['token0_address']),lp_total_supply_usd: pool_info['lp_total_supply_usd']} as PumpData 
					pump_list.push(pump_dict);
				}
			}
			if ("amount1In" in row && pool_info['token1_address'] === "EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c") {
				//console.log('amount1In1', row['amount1In'], parseFloat(row['amount1In']));
				if (parseFloat(row['amount1In']) > 0.1) {
					let temp_pump_dict= await getJettonData(pool_info['token0_address']);				
					let pump_dict = {name: temp_pump_dict["name"], image_url: temp_pump_dict["image_url"],symbol: temp_pump_dict["symbol"], description: temp_pump_dict["description"],type: "BUY",price: row['amount1In'],stonfi_link: createStonfiLink(pool_info['token0_address'], pool_info['token1_address']),lp_total_supply_usd: pool_info['lp_total_supply_usd']} as PumpData 
					pump_list.push(pump_dict);
				}
			}
			
			if ("amount0Out" in row && pool_info['token0_address'] === "EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c") {
				//console.log('amount0OutIn0',row['amount0Out'],parseFloat(row['amount0Out']));
				if (parseFloat(row['amount0Out']) > 0.1) {
					let temp_pump_dict = await getJettonData(pool_info['token1_address']); 
					let pump_dict = {name: temp_pump_dict["name"], image_url: temp_pump_dict["image_url"],symbol: temp_pump_dict["symbol"], description: temp_pump_dict["description"],type: "SELL",price: row['amount0Out'],stonfi_link: createStonfiLink(pool_info['token1_address'], pool_info['token0_address']),lp_total_supply_usd: pool_info['lp_total_supply_usd']} as PumpData 
					pump_list.push(pump_dict);
				}
			}
			if ("amount1Out" in row && pool_info['token1_address'] === "EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c") {
				//console.log('amount1OutIn1',parseFloat(row['amount1Out']));
				if (parseFloat(row['amount1Out']) > 0.1) {
					let temp_pump_dict= await getJettonData(pool_info['token0_address']);				
					let pump_dict = {name: temp_pump_dict["name"], image_url: temp_pump_dict["image_url"],symbol: temp_pump_dict["symbol"], description: temp_pump_dict["description"],type: "SELL",price: row['amount1Out'],stonfi_link: createStonfiLink(pool_info['token0_address'], pool_info['token1_address']),lp_total_supply_usd: pool_info['lp_total_supply_usd']} as PumpData 
					pump_list.push(pump_dict);
				}
			}
			
			
			
		}
	
	//console.log("in pump",pump_list);
	
		return {'pump_list':pump_list,'lastest_block': lastest_block+1}
	} 
}
