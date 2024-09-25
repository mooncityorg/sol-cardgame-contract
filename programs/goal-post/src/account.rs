use anchor_lang::prelude::*;

#[account]
#[derive(Default)]
pub struct GlobalPool {
    // Community owner
    pub super_admin: Pubkey, // 32
    // Backend signer for multisig
    pub authority_signer: Pubkey, // 32
}

impl GlobalPool {
    pub const LEN: usize = 8 + 32 + 32;
}
