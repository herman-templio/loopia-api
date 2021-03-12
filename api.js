let debug
try {
    // might not be installed
    debug=require('debug')('loopia')
} catch(e) {
    debug = function() {}
}
let dotenv=require('dotenv').config()

if(process.env.LOOPIA_DEBUG_ENABLED) {
    try { require('debug').enable('loopia') } catch(e) {}
}

let server_url='https://api.loopia.se/RPCSERV'
var xmlrpc = require('xmlrpc')
//let client=xmlrpc.createClient({host:'api.loopia.se',port:443,path:'/RPCSERV'})
let client=xmlrpc.createSecureClient('https://api.loopia.se/RPCSERV')

async function call(method,args,subuser,user,password) {
    user=user||process.env.LOOPIA_USER
    password=password||process.env.LOOPIA_PW
    args=args||[]
    if(subuser) args.unshift(subuser)
    args.unshift(password)
    args.unshift(user)
    debug('Calling', method, args)

    return new Promise(function(resolve,reject) {

        client.methodCall(method,args,function(error,value) {
            if(error) {
                console.error(error);
                console.log('req headers:', error.req && error.req._header);
                console.log('res code:', error.res && error.res.statusCode);
                console.log('res body:', error.body);
                reject(error)
            } else
                resolve(value)
        })
    })
}

class LoopiaApi {
    // Customer api
    async addDomain(domain, subuser,user,password) {
        return call('addDomain',[domain],subuser,user,password)
    }
    async addSubDomain(domain, subDomain, subuser,user,password) {
        return call('addSubDomain',[domain,subDomain],subuser,user,password)
    }
    async addZoneRecord(domain,subdomain,record,subuser,user,password) {
        return call('addZoneRecord',[domain,subdomain,record],subuser,user,password)
    }
    async domainIsFree(domain, subuser,user,password) {
        return call('domainIsFree',[domain],subuser,user,password)
    }
    async getCreditsAmount(with_vat,subuser,user,password) {
        return call('getCreditsAmount',[with_vat],subuser,user,password)
    }
    async getDomains(subuser,user,password) {
        return call('getDomains',[],subuser,user,password)
    }
    async getDomain(domain,subuser,user,password) {
        return call('getDomain',[domain],subuser,user,password)
    }
    async getInvoice(reference_no,with_vat,subuser,user,password) {
        return call('getInvoice',[reference_no,with_vat],subuser,user,password)
    }
    async getSubDomains(domain,subuser,user,password) {
        return call('getSubDomains',[domain],subuser,user,password)
    }
    async getUnpaidInvoices(with_vat,subuser,user,password) {
        return call('getUnpaidInvoices',[with_vat],subuser,user,password)
    }
    async getZoneRecords(domain,subdomain,subuser,user,password) {
        return call('getZoneRecords',[domain,subdomain],subuser,user,password)
    }
    async orderDomain(domain,has_accepted_terms_and_conditions,subuser,user,password) {
        return call('orderDomain',[domain,has_accepted_terms_and_conditions],subuser,user,password)
    }
    async payInvoiceUsingCredits(reference_no,subuser,user,password) {
        return call('payInvoiceUsingCredits',[reference_no],subuser,user,password)
    }
    async removeDomain(domain,deactivate,subuser,user,password) {
        return call('removeDomain',[domain,deactivate],subuser,user,password)
    }
    async removeSubdomain(domain,subdomain,subuser,user,password) {
        return call('removeSubdomain',[domain,subdomain],subuser,user,password)
    }
    async removeZoneRecord(domain,subdomain,record_id,subuser,user,password) {
        return call('removeZoneRecord',[domain,subdomain,record_id],subuser,user,password)
    }
    async transferDomain(domain,auth_code,subuser,user,password) {
        return call('transferDomain',[domain,auth_code],subuser,user,password)
    }
    async updateDNSServers(domain,nameservers,subuser,user,password) {
        return call('updateDNSServers',[domain,nameservers],subuser,user,password)
    }
    async updateZoneRecord(domain,subdomain,record,subuser,user,password) {
        return call('updateZoneRecord',[domain,subdomain,record],subuser,user,password)
    }

    // Reseller api

    async getCustomers(subuser,user,password) {
        return call('getCustomers',[],subuser,user,password)
    }

}
async function test() {
    //let result = await getDomains(); debug('Result: ',result);
    //result=await getDomain('stalbambu.se'); debug('Result: ',result);
    //result=await getZoneRecords('stalbambu.se','@'); debug('Result: ',result);
    let rec={type:'TXT',ttl:300,rdata:'hello'}
    result=await addZoneRecord('stalbambu.se','@',rec); debug('Result: ',result);
}


module.exports=new LoopiaApi()
