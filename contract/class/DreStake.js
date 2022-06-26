const contract = require("@truffle/contract")
const DeployJs = require("../builds/DreStake.json")
const { getErc20 } = require("../services/client/erc20")

class DreStake {
    #web3
    #account
    #handler

    static async create(
        web3,
        tokenAddress,
        startTimestamp,
        endTimestamp,
        lockTimestamp,
        lockPercentage
    ) {
        const accounts = await web3.eth.getAccounts()
        const deployContract = contract({
            abi: DeployJs.abi,
            unlinked_binary: DeployJs.bytecode,
        })
        deployContract.setProvider(web3.currentProvider)
        const stake = await deployContract.new(
            tokenAddress,
            startTimestamp,
            endTimestamp,
            lockTimestamp,
            lockPercentage,
            { from: accounts[0] }
        )
        return stake.address;
    }

    async init(web3, address, hasAccount = true, accountIndex = 0) {
        this.#web3 = web3
        if (hasAccount) {
            const accounts = await this.#web3.eth.getAccounts()
            this.#account = accounts[accountIndex]
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
        return this.#handler.methods['stakingToken()']();
    }

    get tokenBalance() {
        return this.#handler.methods['tokenTotalStaked()']();
    }

    get startTimestamp() {
        return this.#handler.methods['startTimestamp()']();
    }
    
    get endTimestamp() {
        return this.#handler.methods['endTimestamp()']();
    }
    
    get lockTimestamp() {
        return this.#handler.methods['lockTimestamp()']();
    }
    
    get lockPercent() {
        return this.#handler.methods['lockPercent()']();
    }

    get unlockTimestamp() {
        return this.#handler.methods['getUnlockTime()']();
    }

    get allStakers() {
        return this.#handler.methods['getAllStakers()']();
    }

    /**
     * Get stake info by address
     * @param {*} address 
     * @returns 
     */

    async stakePoint(address) {
        return await this.#handler.methods['getPoint(address)'](address);
    }

    async stakeAmount(address) {
        return await this.#handler.methods['stakeAmount(address)'](address);
    }

    async stakeMaxPoint(address) {
        const info = await this.#handler.methods['stakes(address)'](address);
        return info[3];
    }

    async stakeInfo(address) {
        const { 1: amount, 3: maxPoint } = await this.#handler.methods['stakes(address)'](address);
        const point = await this.stakePoint(address)
        return {
            point,
            amount,
            maxPoint,
        }
    }

    async maxAmount2Withdraw(address) {
        return await this.#handler.methods['amount_canWithdraw(address)'](address);
    }

    /**
     * Get stake info by me
     * @returns 
     */

     async myStakePoint() {
        return await this.#handler.methods['stakePoint_msgSender()']({ from: this.#account });
    }

    async myStakeAmount() {
        return await this.#handler.methods['stakeAmount_msgSender()']({ from: this.#account });
    }

    async myStakeMaxPoint() {
        return await this.stakeMaxPoint(this.#account)
    }

    async myStakeInfo() {
        return await this.stakeInfo(this.#account);
    }

    /**
     * Stake and withdraw
     * @param {*} amount amount of token
     * @returns 
     */
    async stake(amount) {
        const tokenAddress = await this.erc20;
        const erc20Handler = await getErc20(tokenAddress)
        await erc20Handler.approve(this.#account, this.address, amount)
        return await this.#handler.methods['stake(uint256)'](amount, { from: this.#account })
    }

    async withdraw(amount) {
        return await this.#handler.methods['withdraw(uint256)'](amount, { from: this.#account })
    }

    async withdrawAll() {
        return await this.#handler.methods['withdrawAll()']({ from: this.#account })
    }
}

module.exports = DreStake