const uuidv4 = require('uuid/v4');
const paymentTemplate="TXN Id:${UUID} ${finEntity}: paying ${amount} from ${userid}";


createOrder=(userid,amount,finEntity)=>{
    const uuid=uuidv4();
    finalDoc = paymentTemplate.replace("${UUID}",uuid)
                            .replace("${finEntity}",finEntity)
                            .replace("${amount}",amount.toString())
                            .replace("${userid}",userid);
    return finalDoc;
};

module.exports.create=createOrder;