import { supabase } from '../supabase/client';

export const taxService = {
  // Get tax deductions for a specific year
  async getDeductions(year) {
    const { data, error } = await supabase
      .from('tax_deductions')
      .select('*')
      .eq('year', year)
      .order('date', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Create a deduction
  async createDeduction(deduction) {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;

    const { data, error } = await supabase
      .from('tax_deductions')
      .insert([{ ...deduction, user_id: userData.user.id }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update a deduction
  async updateDeduction(id, updates) {
    const { data, error } = await supabase
      .from('tax_deductions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete a deduction
  async deleteDeduction(id) {
    const { error } = await supabase
      .from('tax_deductions')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }
};
