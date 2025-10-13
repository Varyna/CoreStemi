using Microsoft.EntityFrameworkCore;
using Stemi.WebAPI.Models.Entities;

namespace Stemi.WebAPI.Data
{
	public class ApplicationDbContext : DbContext
	{
		public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

		public DbSet<Lesson> Lessons { get; set; }
		public DbSet<DirectoryTime> DirectoryTimes { get; set; }
		public DbSet<DirectoryGroups> DirectoryGroups { get; set; }
		public DbSet<DirectoryCabinets> DirectoryCabinets { get; set; }
		public DbSet<Student> Students { get; set; }
		public DbSet<Session> Sessions { get; set; }
		public DbSet<Payment> Payments { get; set; }

		protected override void OnModelCreating(ModelBuilder modelBuilder)
		{
			modelBuilder.Entity<Lesson>()
				.HasOne(l => l.DirectoryGroup)
				.WithMany()
				.HasForeignKey(l => l.DirectoryGroupsId);

			modelBuilder.Entity<Lesson>()
				.HasOne(l => l.DirectoryTime)
				.WithMany()
				.HasForeignKey(l => l.DirectoryTimeId);

			modelBuilder.Entity<Lesson>()
				.HasOne(l => l.DirectoryCabinets)
				.WithMany()
				.HasForeignKey(l => l.DirectoryCabinetsId);

			modelBuilder.Entity<Student>(entity =>
			{
				entity.HasKey(s => s.Id);
				entity.HasIndex(s => s.UserId).IsUnique();
				entity.HasIndex(s => s.Email).IsUnique();
				entity.HasIndex(s => s.StudentGroup);

				entity.HasMany(s => s.Sessions)
					  .WithOne(se => se.Student)
					  .HasForeignKey(se => se.StudentsId)
					  .OnDelete(DeleteBehavior.Cascade);

				entity.HasMany(s => s.Payments)
					  .WithOne(p => p.Student)
					  .HasForeignKey(p => p.StudentsId)
					  .OnDelete(DeleteBehavior.Cascade);
			});

			// Конфигурации для Session
			modelBuilder.Entity<Session>(entity =>
			{
				entity.HasKey(s => s.Id);
				entity.HasIndex(s => s.StudentsId);
				entity.HasIndex(s => s.SessionYear);
				entity.HasIndex(s => s.Group);
			});

			// Конфигурации для Payment
			modelBuilder.Entity<Payment>(entity =>
			{
				entity.HasKey(p => p.Id);
				entity.HasIndex(p => p.StudentsId);
				entity.HasIndex(p => p.PaymentDate);
			});
		}
		public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
		{
			var entries = ChangeTracker.Entries()
				.Where(e => e.Entity is Student && (e.State == EntityState.Modified));

			foreach (var entityEntry in entries)
			{
				((Student)entityEntry.Entity).UpdatedAt = DateTime.UtcNow;
			}

			return base.SaveChangesAsync(cancellationToken);
		}
	}
}
