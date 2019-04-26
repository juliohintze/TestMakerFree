using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TestMakerFreeWebApp.Data.Models;

namespace TestMakerFreeWebApp.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        #region Constructor
        public ApplicationDbContext(DbContextOptions options) : base(options)
        {

        }
        #endregion

        #region Methods
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<ApplicationUser>().ToTable("Users");
            modelBuilder.Entity<ApplicationUser>().HasMany(u =>
                u.Quizzes).WithOne(q => q.User);
            modelBuilder.Entity<ApplicationUser>().HasMany(u => 
                u.Tokens).WithOne(i => i.User);

            modelBuilder.Entity<Quiz>().ToTable("Quizzes");
            modelBuilder.Entity<Quiz>().Property(q =>
                q.Id).ValueGeneratedOnAdd();

            modelBuilder.Entity<Quiz>().HasOne(q => q.User).WithMany(u =>
                u.Quizzes);
            modelBuilder.Entity<Quiz>().HasMany(qz => qz.Questions).WithOne(qs =>
                qs.Quiz).OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<Quiz>().HasMany(qz => qz.Results).WithOne(r => 
                r.Quiz).OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<Quiz>().Ignore("Liked");

            modelBuilder.Entity<QuizTaken>()
                .HasKey(qu => new { qu.UserId, qu.QuizId });

            modelBuilder.Entity<QuizTaken>()
                .HasOne(qu => qu.User)
                .WithMany(u => u.TakenQuizzes)
                .HasForeignKey(qu => qu.UserId);

            modelBuilder.Entity<QuizTaken>()
                .HasOne(qu => qu.Quiz)
                .WithMany(q => q.TakenBy)
                .HasForeignKey(qu => qu.QuizId);

            modelBuilder.Entity<QuizLiked>()
                .HasKey(qu => new { qu.UserId, qu.QuizId });

            modelBuilder.Entity<QuizLiked>()
                .HasOne(qu => qu.User)
                .WithMany(u => u.LikedQuizzes)
                .HasForeignKey(qu => qu.UserId);

            //modelBuilder.Entity<QuizLiked>()
            //    .HasOne(qu => qu.Quiz)
            //    .WithMany(q => q.LikedBy)
            //    .HasForeignKey(qu => qu.QuizId);

            modelBuilder.Entity<Token>().ToTable("Tokens");
            modelBuilder.Entity<Token>().Property(i => i.Id).ValueGeneratedOnAdd();
            modelBuilder.Entity<Token>().HasOne(i => i.User).WithMany(u => u.Tokens);

            modelBuilder.Entity<Question>().ToTable("Questions");
            modelBuilder.Entity<Question>().Property(q => q.Id).ValueGeneratedOnAdd();
            modelBuilder.Entity<Question>().HasOne(q => q.Quiz).WithMany(q => q.Questions);
            modelBuilder.Entity<Question>().HasMany(q => q.Answers).WithOne(a => a.Question).OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Answer>().ToTable("Answers");
            modelBuilder.Entity<Answer>().Property(a => a.Id).ValueGeneratedOnAdd();
            modelBuilder.Entity<Answer>().HasOne(a => a.Question).WithMany(q => q.Answers);

            modelBuilder.Entity<Result>().ToTable("Results");
            modelBuilder.Entity<Result>().Property(r => r.Id).ValueGeneratedOnAdd();
            modelBuilder.Entity<Result>().HasOne(r => r.Quiz).WithMany(q => q.Results);
        }

        //protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        //{
        //    if (!optionsBuilder.IsConfigured)
        //    {
        //        optionsBuilder.UseMySql("server=localhost;database=TestMakerFree;uid=root;pwd=;");
        //    }
        //}
        #endregion

        #region Properties
        public DbSet<Quiz> Quizzes { get; set; }
        public DbSet<QuizTaken> QuizzesTaken { get; set; }
        public DbSet<QuizLiked> QuizzesLiked { get; set; }
        public DbSet<Question> Questions { get; set; }
        public DbSet<Answer> Answers { get; set; }
        public DbSet<Result> Results { get; set; }
        public DbSet<Token> Tokens { get; set; }
        #endregion
    }
}
