﻿//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace iPOS.Web.Database
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    
    public partial class dbpawnshopEntities : DbContext
    {
        public dbpawnshopEntities()
            : base("name=dbpawnshopEntities")
        {
        }
    
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            throw new UnintentionalCodeFirstException();
        }
    
        public virtual DbSet<tbl_customer> tbl_customer { get; set; }
        public virtual DbSet<tbl_ipos_customer> tbl_ipos_customer { get; set; }
        public virtual DbSet<tbl_ipos_itemcategory> tbl_ipos_itemcategory { get; set; }
        public virtual DbSet<tbl_ipos_itemtype> tbl_ipos_itemtype { get; set; }
        public virtual DbSet<tbl_ipos_no_generator> tbl_ipos_no_generator { get; set; }
        public virtual DbSet<tbl_ipos_pawnshop_transactions> tbl_ipos_pawnshop_transactions { get; set; }
        public virtual DbSet<tbl_product> tbl_product { get; set; }
        public virtual DbSet<tbl_product_add_info> tbl_product_add_info { get; set; }
        public virtual DbSet<tbl_product_brand_setup> tbl_product_brand_setup { get; set; }
        public virtual DbSet<tbl_product_category_info> tbl_product_category_info { get; set; }
        public virtual DbSet<tbl_product_category_setup> tbl_product_category_setup { get; set; }
        public virtual DbSet<tbl_product_category_sub1> tbl_product_category_sub1 { get; set; }
        public virtual DbSet<tbl_product_category_sub2> tbl_product_category_sub2 { get; set; }
        public virtual DbSet<tbl_product_category_sub3> tbl_product_category_sub3 { get; set; }
        public virtual DbSet<tbl_product_type> tbl_product_type { get; set; }
        public virtual DbSet<tbl_ipos_karat> tbl_ipos_karat { get; set; }
        public virtual DbSet<tbl_ipos_appraiseditem> tbl_ipos_appraiseditem { get; set; }
        public virtual DbSet<tbl_ipos_pawneditem_terms> tbl_ipos_pawneditem_terms { get; set; }
        public virtual DbSet<tbl_ipos_pawneditem> tbl_ipos_pawneditem { get; set; }
        public virtual DbSet<tbl_employee> tbl_employee { get; set; }
        public virtual DbSet<tbl_ipos_pawneditem_amortization_schedule> tbl_ipos_pawneditem_amortization_schedule { get; set; }
    }
}
