#include <bits/stdc++.h>
using namespace std;

#define int long long

const int MOD = 1e9 + 7;

int modExp(int base, int exp, int mod) {
    int result = 1;
    while (exp > 0) {
        if (exp % 2 == 1) {
            result = (result * base) % mod;
        }
        base = (base * base) % mod;
        exp /= 2;
    }
    return result;
}

int computePQMod(int P, int Q) {
    int Q_inv = modExp(Q, MOD - 2, MOD);
    return (P * Q_inv) % MOD;
}

void solve(){
    int n,q;
    cin>>n>>q;
    vector<int> v(n);
    set<int> st;
    for(int i=0;i<n;i++) {
        cin>>v[i];
        v[i]--;
        st.insert(i);
    }
    vector<char> s(n);
    for(int i=0;i<n;i++) cin>>s[i];

    vector<int> x(n);
    for(int i=n-1;i>=0;i--){
        x[i] = st.size();
        st.erase(v[i]);
    }

    int count = 0;
    for(int i=0;i<n;i++){
        if(s[i] == 'L' && i+1<n && s[i+1] == 'R' && x[i] != i+1) {
            count++;
        }
    }

    for(int i=0;i<q;i++){
        int a;
        cin>>a;
        a--;
        if(s[a] == 'L') {
            if(a+1<n && s[a+1] == 'R' && x[a] != a+1) {
                count--;
            }
            if(a-1>=0 && s[a-1] == 'L' && x[a-1] != a) {
                count++;
            }
            s[a] = 'R';
        } else {
            if(a-1>=0 && s[a-1] == 'L' && x[a-1] != a) {
                count--;
            }
            if(a+1<n && s[a+1] == 'R' && x[a] != a+1) {
                count++;
            }
            s[a] = 'L';
        }
        if(!count) cout<<"YES"<<endl;
        else cout<<"NO"<<endl;
    }
}

signed main() {
    int t;
    cin>>t;
    while(t--){
        solve();
    }
    return 0;
}