id:{},
userId:{}, // whose currency is this
currencies:[{
status:{default:true}, //block/deactive
country:{}, //india/japan etc
address:{},
balance:{default:0}, //$inc will help us out to increase and decrease this value
freezeBalance:{default:0},
name:{unique:true}, //currency name (rupees/US_dollor/repple/etc...)
currency:{} // inr/usd/eur/etc...
}]