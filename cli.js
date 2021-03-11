const debug=require('debug')('loopia')
const { Command } = require('commander');
const program = new Command()
const api=require('./api')

program.description(`Loopia cli. Requires an api-username and password. Can be given with env-vars (LOOPIA_USER, LOOPIA_PW),
in a .env file, or on command-line. A subuser is required for reseller commands, and optional for customer For more info see: https://www.loopia.se/api/`)
program.option('--debug','Output debug info')
program.option('--real-api',"Use real api instead of stub")
program.option('--user <u>','Use given username')
program.option('--subuser <s>','Use given subuser')
program.option('--password <p>',"Use given")

async function call(fun) {
    let opts=program.opts()
    if(opts.debug) require('debug').enable('loopia')
    try{
        let res=await fun(opts.subuser,opts.user,opts.password);
        console.log(res);
    } catch(e) {
        console.log(e);
    }
}
//
program.command('addDomain <domain>')
    .action(async function(domain,options) {
        call(async (subuser,user,password) => { return api.addDomain(domain,subuser,user,password) })
    })
//
program.command('addZoneRecord <domain>> <data>')
    .option('--sub-domain <sub>','',)
    .option('--type <t>','record type (default A)','A')
    .option('--ttl <t>','TTL (default 300)',300)
    .option('--priority <t>','Priority for MX (default 10)',10)
    .action(async function(domain,data,options) {
        let subdomain=options.subDomain||'@'
        let record={
            type:options.type||'A',
            ttl:options.ttl||300,
            rdata:data
        }
        if(record.type=='MX') record.priority=options.priority||10

        call(async (subuser,user,password) => { return api.addZoneRecord(domain,subdomain,record,subuser,user,password) })
    })
//
program.command('domainIsFree <domain>')
    .action(async function(domain,options) {
        call(async (subuser,user,password) => { return api.domainIsFree(domain,subuser,user,password) })
    })
//
program.command('getCreditsAmount')
    .option('--with-vat','')
    .action(async function(options) {
        call(async (subuser,user,password) => { return api.getCreditsAmount(options.withVat&&true||false,subuser,user,password) })
    })
//
program.command('getDomains')
    .action(async function(options) {
        call(async (subuser,user,password) => { return api.getDomains(subuser,user,password) })
    })
//
program.command('getDomain <domain>')
    .action(async function(domain,options) {
        call(async (subuser,user,password) => { return api.getDomain(domain,subuser,user,password) })
    })
//
program.command('getInvoice <reference_no>')
    .action(async function(reference_no,options) {
        call(async (subuser,user,password) => { return api.getInvoice(reference_no,subuser,user,password) })
    })
//
program.command('getSubDomains <domain>')
    .action(async function(domain,options) {
        call(async (subuser,user,password) => { return api.getSubDomains(domain,subuser,user,password) })
    })
//
program.command('getUnpaidInvoices')
    .option('--with-vat','')
    .action(async function(options) {
        call(async (subuser,user,password) => { return api.getUnpaidInvoices(options.withVat&&true||false,subuser,user,password) })
    })
//
program.command('getZoneRecords <domain>')
    .option('--sub-domain <sub>','',)
    .action(async function(domain,options) {
        let subdomain=options.subDomain||'@'
        call(async (subuser,user,password) => { return api.getZoneRecords(domain,subdomain,subuser,user,password) })
    })
//
program.command('orderDomain <domain>')
    .option('--has-accepted','',)
    .action(async function(domain,options) {
        let hasAccetpted=options.hasAccetpted&&true||false
        call(async (subuser,user,password) => { return api.orderDomain(domain,hasAccetpted,subuser,user,password) })
    })
//
program.command('payInvoiceUsingCredits <reference_no>')
    .action(async function(reference_no,options) {
        call(async (subuser,user,password) => { return api.payInvoiceUsingCredits(reference_no,subuser,user,password) })
    })
//
program.command('removeDomain <domain>')
    .option('--deactivate','',)
    .action(async function(domain,options) {
        let deactivate=options.deactivate&&true||false
        call(async (subuser,user,password) => { return api.removeDomain(domain,deactivate,subuser,user,password) })
    })
//
program.command('removeSubdomain <domain> <subdomain>')
    .action(async function(domain,subdomain,options) {
        call(async (subuser,user,password) => { return api.removeSubdomain(domain,subdomain,subuser,user,password) })
    })
//
program.command('removeZoneRecord <domain> <record_id>')
    .option('--sub-domain <sub>','',)
    .action(async function(domain,record_id,options) {
        let subdomain=options.subDomain||'@'
        call(async (subuser,user,password) => { return api.removeZoneRecord(domain,subdomain,record_id,subuser,user,password) })
    })
//
program.command('transferDomain <domain> <auth_code>')
    .action(async function(domain,auth_code,options) {
        call(async (subuser,user,password) => { return api.transferDomain(domain,auth_code,subuser,user,password) })
    })
//
program.command('updateDNSServers <domain> <nameservers...>')
    .action(async function(domain,nameservers,options) {
        call(async (subuser,user,password) => { return api.updateDNSServers(domain,nameservers,subuser,user,password) })
    })
//
program.command('updateZoneRecord <domain> <id> <data>')
    .option('--sub-domain <sub>','',)
    .option('--type <t>','record type (default A)','A')
    .option('--ttl <t>','TTL (default 300)',300)
    .option('--priority <t>','Priority for MX (default 10)',10)
    .action(async function(domain,id,data,options) {
        let subdomain=options.subDomain||'@'
        let record={
            type:options.type||'A',
            ttl:options.ttl||300,
            rdata:data,
            id:id
        }
        if(record.type=='MX') record.priority=options.priority||10

        call(async (subuser,user,password) => { return api.updateZoneRecord(domain,subdomain,record,subuser,user,password) })
    })
//
program.command('getCustomers')
    .action(async function(options) {
        call(async (subuser,user,password) => { return api.getCustomers(user,password) })
    })

program.parseAsync(process.argv)
