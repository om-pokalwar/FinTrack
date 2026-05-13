import { supabase } from '../supabase/client';

export const transactionService = {
  // Get all transactions for the current user
  async getTransactions() {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Create a new transaction
  async createTransaction(transaction) {
    // transaction object should contain: title, amount, type, category, date
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;

    const { data, error } = await supabase
      .from('transactions')
      .insert([{ ...transaction, user_id: userData.user.id }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update a transaction
  async updateTransaction(id, updates) {
    const { data, error } = await supabase
      .from('transactions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete a transaction
  async deleteTransaction(id) {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }
};
