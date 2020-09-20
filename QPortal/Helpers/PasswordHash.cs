using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace QPortal.Helpers
{
    public static class PasswordHash
    {
        public static string HashPassword(string password)
        {
            var provider = new MD5CryptoServiceProvider();
            var encoding = new UnicodeEncoding();
            var hash = provider.ComputeHash(encoding.GetBytes(password));
            return Convert.ToBase64String(hash);
        }
    }
}
