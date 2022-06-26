const contract = require("@truffle/contract")
const DeployJs = require("../builds/Pool.json")
const { getErc20 } = require("../services/client/erc20")

class Pool {
    #web3
    #account
    #handler

    static async create(
        web3,
        tokenAddress,
        tokenForSale,
        tradeValue,
        startTime,
        endTime,
        minimumAmount,
        ownerAddress,
        signerAddress,
        feePercent
    ) {
        const accounts = await web3.eth.getAccounts()
        const deployContract = contract({
            abi: DeployJs.abi,
            unlinked_binary: DeployJs.bytecode,
        })
        deployContract.setProvider(web3.currentProvider)
        const pool = await deployContract.new(
            tokenAddress,
            tokenForSale,
            tradeValue,
            startTime,
            endTime,
            minimumAmount,
            ownerAddress,
            signerAddress,
            feePercent,
            { from: accounts[0] }
        )
        return pool.address
    }

    async init(web3, address, hasAccount = true) {
        this.#web3 = web3
        if (hasAccount) {
            const accounts = await this.#web3.eth.getAccounts()
            this.#account = accounts[0]
        }
        const deployContract = contract({
            abi: DeployJs.abi,
            unlinked_binary: DeployJs.bytecode,
        })
        deployContract.setProvider(this.#web3.currentProvider)
        this.#handler = await deployContract.at(address)
    }

    get address() {
        return this.#handler.address;
    }

    get erc20() {
        return this.#handler.methods['erc20()']()
    }

    get isFunded() {
        return this.#handler.methods['isSaleFunded()']()
    }

    get decimals() {
        return this.#handler.methods['decimals()']()
    }

    get isUnsoldTokensRedeemed() {
        return this.#handler.methods['isUnsoldTokensRedeemed()']()
    }

    get tradeValue() {
        return this.#handler.methods['tradeRatio()']()
    }

    get startDate() {
        return this.#handler.methods['startDate()']()
    }

    get endDate() {
        return this.#handler.methods['endDate()']()
    }

    get tokensAllocated() {
        return this.#handler.methods['tokensAllocated()']()
    }

    get tokensForSale() {
        return this.#handler.methods['tokensForSale()']()
    }

    get individualMinimumAmount() {
        return this.#handler.methods['individualMinimumAmount()']()
    }

    get isPaused() {
        return this.#handler.methods['paused()']()
    }

    get tokensAvailable() {
        return this.#handler.methods['tokensAvailable()']()
    }

    get tokensLeft() {
        return this.#handler.methods['tokensLeft()']()
    }

    get whitelist() {
        return this.#handler.methods['whitelist()']()
    }

    get owner() {
        return this.#handler.methods['owner()']()
    }

    get signer() {
        return this.#handler.methods['signer()']()
    }

    async individualMaximumAmount(address = undefined) {
        if (address) {
            return this.#handler.methods['getIndividualMaximumAmount(address)'](address)
        }
        if (this.#account) {
            return this.#handler.methods['getIndividualMaximumAmount(address)'](this.#account) 
        }
        throw "address is required"
    }

    async isWhitelisted(address) {
        if (address) {
            return this.#handler.methods['isWhitelisted(address)'](address)
        }
        if (this.#account) {
            return this.#handler.methods['isWhitelisted(address)'](this.#account) 
        }
        throw "address is required"
    }

    async getStatus() {
        const cur = Math.floor(Date.now() / 1000)
        const startDate = await this.startDate
        if (cur < startDate) {
            return "Upcoming"
        }
        const isSaleFunded = await this.isSaleFunded
        if (!isSaleFunded) {
            return "unFunded"
        }
        const endDate = await this.endDate
        if (cur < endDate) {
            return "Opened"
        }
        const pause = await this.isPaused
        if (pause) {
            return "Failed"
        }
        return "Success"
    }

    async getInformation() {
        const {
            0: erc20,
            1: decimals,
            2: tradeRatio,
            3: startDate,
            4: endDate,
            5: tokensAllocated,
            6: tokensForSale,
            7: totalCost,
        } = await this.#handler.methods['getInformation()']()

        return { erc20, decimals, tradeValue: tradeRatio, startDate, endDate, tokensAllocated, tokensForSale, totalCost }
    }

    async getCostFromTokens(amount) {
        return await this.#handler.methods['getCostFromTokens(uint256)'](amount)
        
    }

    async setErc20(address) {
        await this.#handler.methods['setErc20(address)'](address, { from: this.#account })
    }

    async setStartDate(timestamp) {
        await this.#handler.methods['setStartDate(uint256)'](timestamp, { from: this.#account })
    }

    async setEndDate(timestamp) {
        await this.#handler.methods['setEndDate(uint256)'](timestamp, { from: this.#account })
    }

    async setTokensForSale(amount) {
        await this.#handler.methods['setTokensForSale(uint256)'](amount, { from: this.#account })
    }

    async setSigner(address) {
        await this.#handler.methods['changeSigner(address)'](address, { from: this.#account })
    }

    async setOwner(address) {
        await this.#handler.methods['transferOwnership(address)'](address, { from: this.#account })
    }

    async isPreStart() {
        return await this.#handler.methods['isPreStart()']()
    }

    async isOpen() {
        return await this.#handler.methods['isOpen()']()
    }

    async isFinalized() {
        return await this.#handler.methods['hasFinalized()']()
    }

    async fund(amount) {
        const erc20Handler = await getErc20(await this.erc20)
        await erc20Handler.approve(this.#account, this.address, amount)
        await this.#handler.methods['fund(uint256)'](amount, { from: this.#account })
    }

    async addToWhitelist(address, maxAmount) {
        if (typeof address == 'string') {
            await this.#handler.methods['addToWhitelist(address,uint256)'](address, maxAmount, { from: this.#account })
        }
        else {
            await this.#handler.methods['addToWhitelist(address[],uint256[])'](address, maxAmount, { from: this.#account })
        }
    }

    async removeFromWhitelist(address) {
        await this.#handler.methods['removeFromWhitelist(address)'](address, { from: this.#account })
    }

    async pause() {
        await this.#handler.methods['pauseContract()']({ from: this.#account })
    }

    async unpause() {
        await this.#handler.methods['unpauseContract()']({ from: this.#account })
    }

    async swap(amount) {
        const fund = await this.getCostFromTokens(amount)
        await this.#handler.methods['swap(uint256)'](amount, { from: this.#account, value: fund })
    }

    async getPurchase(purchaseId) {
        const {
            0: tokensAmount,
            1: purchaser,
            2: fundsAmount,
            3: timestamp,
            4: wasFinalized,
            5: wasFailed
        } = await this.#handler.methods['getPurchase(uint256)'](purchaseId)
        return { tokensAmount, purchaser, fundsAmount, timestamp, wasFinalized, wasFailed }
    }

    async getMyPurchases() {
        const IDlist = await this.#handler.methods['getMyPurchases()']({ from: this.#account })
        const purchases = IDlist.map(async id => {
            const info = await this.getPurchase(id)
            return {
                id,
                ...info
            }
        })
        return await Promise.all(purchases)
    }

    async redeemTokens(purchaseId = null) {
        if (purchaseId == null) {
            await this.#handler.methods['redeemTokens()']({ from: this.#account })
        }
        else {
            await this.#handler.methods['redeemTokens(uint256)'](purchaseId, { from: this.#account })
        }
    }

    async redeemFunds(purchaseId = null) {
        if (purchaseId == null) {
            await this.#handler.methods['redeemFunds()']({ from: this.#account })
        }
        else {
            await this.#handler.methods['redeemFunds(uint256)'](purchaseId, { from: this.#account })
        }
    }

    async withdrawUnsoldTokens() {
        await this.#handler.methods['withdrawUnsoldTokens()']({ from: this.#account })
    }

    async withdrawFunds() {
        await this.#handler.methods['withdrawFunds()']({ from: this.#account })
    }
}

module.exports = Pool
