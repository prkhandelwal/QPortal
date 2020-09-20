using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace QPortal.Models
{
    public class User
    {
        public string UserId { get; set; }
        [Required]
        [DataType(DataType.EmailAddress)]
        [EmailAddress]
        public string UserName { get; set; }
        [MaxLength(100, ErrorMessage = "First name should be winthin 100 characters")]
        public string FirstName { get; set; }
        [MaxLength(100, ErrorMessage = "Last name should be within 100 characters")]
        public string LastName { get; set; }
        [Required]
        public string Password { get; set; }
        public bool IsAdmin { get; set; }
        public string UserRole
        {
            get
            {
                if (this.IsAdmin)
                {
                    return UserRoles.Admin;
                }
                else
                {
                    return UserRoles.User;
                }
            }
        }
        [MaxLength(300, ErrorMessage = "Address should be within 300 characters")]
        public string Address { get; set; }
        [JsonConverter(typeof(CustomDateTimeConverter))]
        [MinimumDateValidation]
        public DateTime DOB { get; set; }
    }

    public static class UserRoles
    {
        public const string User = "User";
        public const string Admin = "Admin";
    }

    public sealed class MinimumDateValidationAttribute : ValidationAttribute
    {
        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            // your validation logic
            if (Convert.ToDateTime(value) >= DateTime.ParseExact("01/01/1920", "dd/MM/yyyy", null))
            {
                return ValidationResult.Success;
            }
            else
            {
                return new ValidationResult("Date is not valid");
            }
        }
    }

    public sealed class CustomDateTimeConverter : IsoDateTimeConverter
    {
        public CustomDateTimeConverter()
        {
            base.DateTimeFormat = "dd/MM/yyyy";
        }
    }
}
