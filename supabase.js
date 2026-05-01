import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'
const supabaseUrl = 'https://jqjyenypnzlhujufalwf.supabase.co'
const supabaseKey = 'sb_publishable_OWlEYnPjUHkyyrfN1ltPkw__lI9Ws6f'
const supabase = createClient(supabaseUrl, supabaseKey)
const checkCode = async (code) => {
  const { data, error } = await supabase
    .from('codes')
    .select('*')
    .eq('code', code)

  console.log(data, error)

  return data.length > 0
}

window.premiumCheckAccess = async function () {
  const code = document.getElementById('premiumAccessCode').value

  const isValid = await checkCode(code)

if (isValid) {
  alert("✅ Code valide !")

  document.getElementById('premiumAccessError').style.display = 'none'
  document.getElementById('premiumLockScreen').style.display = 'none'
} else {
  alert("❌ Code invalide")
}
}