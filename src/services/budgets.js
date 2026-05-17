import { supabase } from '../supabase/client';

export const budgetService = {
  // Get budgets for a specific month (YYYY-MM)
  async getBudgets(month) {
    const { data, error } = await supabase
      .from('budgets')
      .select('*')
      .eq('month', month)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Upsert a budget (insert or update)
  async upsertBudget(budget) {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;

    const { data, error } = await supabase
      .from('budgets')
      .upsert(
        { ...budget, user_id: userData.user.id },
        { onConflict: 'user_id,category,month' }
      )
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete a budget
  async deleteBudget(id) {
    const { error } = await supabase
      .from('budgets')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }
};
